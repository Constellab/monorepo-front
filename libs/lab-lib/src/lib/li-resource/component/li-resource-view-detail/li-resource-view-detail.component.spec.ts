import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceViewDetailComponent } from './li-resource-view-detail.component';

describe('LabViewConfigDetailComponent', () => {
  let component: LiResourceViewDetailComponent;
  let fixture: ComponentFixture<LiResourceViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
