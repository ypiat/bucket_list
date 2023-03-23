import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketFilesComponent } from './bucket-files.component';

describe('BucketFilesComponent', () => {
  let component: BucketFilesComponent;
  let fixture: ComponentFixture<BucketFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BucketFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BucketFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
