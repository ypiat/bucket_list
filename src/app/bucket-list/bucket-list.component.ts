import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css']
})

export class BucketListComponent {
  //declaring arrays
  buckets: any;
  cities:any;

  id = 0//for unique id in json

  //declaring variables for ngClass in template
  buttonHide = false; //for button in div with all buckets
  divHide = true; //for div for creating new bucket
  warningHide = true; //for warning about filling all data in fields

  //declaring form
  submittingForm = this.formBuilder.group({
    name: '',
    location: ''
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    //fetching data from server(json)
    this.http.get('http://localhost:3000/buckets').subscribe(res => {
      this.buckets = res;
      //reverse array so a newest bucket is higher in list
      this.buckets = this.buckets.reverse();
      this.id = +this.buckets[0].id;
    })
    this.http.get('http://localhost:3000/cities').subscribe(res => {
      this.cities = res;
    })
  }


  //func for open div for creating new bucket
  create() {
    this.buttonHide = true;//hide button in main div
    this.divHide = false;
  }

  //hide warning
  hideWarning() {
    this.warningHide = true;
  }

 //func for handeling creation of new bucket
 onSubmit(): void {
  //checking if all fields aren't empty
  if (!this.submittingForm.value.name || !this.submittingForm.value.location) {
    this.warningHide = false;
  } else {
    //getting data from form and making new obj with data
    let newBucket = {
      id: ++this.id,
      ...this.submittingForm.value,
      storageSize: '4.9 GB',
      files: []
    }

    //posting data to json
    this.http.post<any>('http://localhost:3000/buckets', newBucket)
          .subscribe(data => this.buckets.unshift(data));//updating buckets array
          
    //resetting form
    this.submittingForm.reset();

    this.buttonHide = false;//show button in main div
    this.divHide = true;//hide dive for creation of new bucket
    this.warningHide = true;//hide warning
    }
  }
}
