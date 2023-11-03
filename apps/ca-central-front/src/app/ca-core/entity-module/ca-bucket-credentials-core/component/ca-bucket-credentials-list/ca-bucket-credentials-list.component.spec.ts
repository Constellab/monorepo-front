import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaBucketCredentialsListComponent} from './ca-bucket-credentials-list.component';

describe('CaAdminBucketCredentialsListComponent', () => {
  let component: CaBucketCredentialsListComponent;
  let fixture: ComponentFixture<CaBucketCredentialsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaBucketCredentialsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaBucketCredentialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
