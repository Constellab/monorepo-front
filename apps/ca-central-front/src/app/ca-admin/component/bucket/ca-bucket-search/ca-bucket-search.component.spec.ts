import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaBucketSearchComponent } from './ca-bucket-search.component';

describe('CaBucketSearchComponent', () => {
  let component: CaBucketSearchComponent;
  let fixture: ComponentFixture<CaBucketSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaBucketSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaBucketSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
