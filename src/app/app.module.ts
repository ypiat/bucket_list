import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { BucketDetailsComponent } from './bucket-details/bucket-details.component';
import { BucketFilesComponent } from './bucket-files/bucket-files.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    BucketListComponent,
    BucketDetailsComponent,
    BucketFilesComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: BucketListComponent },
      { path: 'buckets/:bucketId', component: BucketFilesComponent },
      { path: 'buckets/details/:bucketId', component: BucketDetailsComponent },
    ]),
    AngularFireModule.initializeApp(environment),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
