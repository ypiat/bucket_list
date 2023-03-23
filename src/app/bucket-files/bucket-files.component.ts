import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/file-upload.service';
import { FileUpload } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-bucket-files',
  templateUrl: './bucket-files.component.html',
  styleUrls: ['./bucket-files.component.css']
})
export class BucketFilesComponent implements OnInit {
  //declaring bucket array
  bucket:any;
  //declaring id
  bucketIdFromRoute: number = -1;
  //declaring array with file's url that are checked for deleting
  filesToDelete: string[] = [];
  //variable for disabling 'delete' button 
  disableBtn = true;

  //declaring variables for uploading files
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: NgbModal,
    private uploadService: FileUploadService
  ) {
    //getting id from current route
    this.route.params.subscribe((param: Params) => {
      this.bucketIdFromRoute = Number(param['bucketId']);
    })
   }

  //fetching data for current bucket
  ngOnInit() {  
    this.http.get('http://localhost:3000/buckets').subscribe(res => {
      let buckets = Object.values(res);
      this.bucket = buckets.find(bucket => bucket.id === this.bucketIdFromRoute);
    })
  }

  //upload files
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload, this.bucket); 
          
      }
    } 
  }

  //show only 22 first character of file's name
  sliceText(text:string) {
      if (text.length > 22) {
        let newText = text.slice(0,22) + '...';
        return newText;
      }
      return text;
  }

  //disabling delete button
  disableButton() {
    if (!this.filesToDelete.length) {
        this.disableBtn = true;
    } else {
        this.disableBtn = false;
      }
  }

  //checking files dor deleting
  toggleCheckbox(event:any) {
    if (event.target.checked) {
      this.filesToDelete.push(event.target.id);
      this.disableBtn = false;
    } else {
      this.filesToDelete.splice(this.filesToDelete.indexOf(event.target.id),1);   
      this.disableButton();
    }
  }

  //handling deleting of files
  deleteObject(): void {
    this.disableBtn = true;
    this.uploadService.deleteFiles(this.filesToDelete, this.bucket);
    this.filesToDelete = []; 
  }

  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true });
  }
  
}
