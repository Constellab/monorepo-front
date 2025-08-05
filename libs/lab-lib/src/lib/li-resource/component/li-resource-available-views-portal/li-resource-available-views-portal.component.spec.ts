import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceAvailableViewsPortalComponent } from './li-resource-available-views-portal.component';

describe('LabResourceViewSpecsListVComponent', () => {
  let component: LiResourceAvailableViewsPortalComponent;
  let fixture: ComponentFixture<LiResourceAvailableViewsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceAvailableViewsPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceAvailableViewsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
