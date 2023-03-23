import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from './models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private basePath = '/uploads';

  constructor(
    private db: AngularFireDatabase, 
    private storage: AngularFireStorage,
    private http: HttpClient
  ) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //format to right size 
  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  //format to right dateformat
  formatDate(timeStamp:any) {
    //get date in right format
    let date = new Date(timeStamp);
    let day = date.getDate();
    let month = (date.getMonth() + 1).toString();
    if (month.length != 2) {
      month = '0' + month;
    }
    let year = date.getFullYear();
    return day + '.' + month + '.' + year;
  } 

  //pushing file to FireStorage
  pushFileToStorage(fileUpload: FileUpload, bucket:any) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL:any) => {
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileData(fileUpload);
        
        //create object with info about file
        let newFile = {
          url: fileUpload.url,
          name: fileUpload.name,
          size: this.formatBytes(+fileUpload.file.size),
          lastModified: this.formatDate(fileUpload.file.lastModified)
        }

        //add file to current bucket
        bucket.files.push(newFile);

        //add file to json server
        this.http.put<any>('http://localhost:3000/buckets/' + bucket.id, JSON.stringify(bucket), this.httpOptions)
        .subscribe();
        });
      })
    ).subscribe();
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }


  //deletting files
  deleteFiles(filesToDelete:any, bucket:any) {
    if (filesToDelete) {
      //array of remaining files
      let notDeleted = bucket.files.filter((f:any) => !filesToDelete.includes(f.url));
      bucket.files = notDeleted;

      //updating json server (without deleted files)
      this.http.put<any>('http://localhost:3000/buckets/' + bucket.id, JSON.stringify(bucket), this.httpOptions)
        .subscribe();

      //deletting files from FireStorage
      for (let i = 0; i<filesToDelete.length; i++) {
        this.storage.storage.refFromURL(filesToDelete[i]).delete();
      }


      return bucket.files;
    }
    
  }

  deleteFilesForDeletedBucket(files:any) {
    //deletting files from FireStorage
      for (let i = 0; i<files.length; i++) {
        this.storage.storage.refFromURL(files[i].url).delete();
      }
  }

}
