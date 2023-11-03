import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaBucketSearchFormComponent} from './ca-bucket-search-form.component';

describe('CaBucketSearchFormComponent', () => {
  let component: CaBucketSearchFormComponent;
  let fixture: ComponentFixture<CaBucketSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaBucketSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaBucketSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
