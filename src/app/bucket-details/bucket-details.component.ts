import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/file-upload.service';


@Component({
  selector: 'app-bucket-details',
  templateUrl: './bucket-details.component.html',
  styleUrls: ['./bucket-details.component.css']
})
export class BucketDetailsComponent {
  //declaring bucket array
  bucket:any;

  //declaring id
  bucketIdFromRoute: number = -1;
  
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

  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true });
  }

  deleteBucket() {
    //deleting bucket's files from FireStorage
    this.uploadService.deleteFilesForDeletedBucket(this.bucket.files);

    this.http.delete('http://localhost:3000/buckets/' + this.bucketIdFromRoute)
          .subscribe(data => console.log(data)); 
  }

}
