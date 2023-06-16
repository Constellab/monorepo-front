import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaAdminBucketsPageComponent} from './ca-admin-buckets-page.component';

describe('CaAdminBucketsPageComponent', () => {
  let component: CaAdminBucketsPageComponent;
  let fixture: ComponentFixture<CaAdminBucketsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminBucketsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminBucketsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
