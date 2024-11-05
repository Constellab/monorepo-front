import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabResourceAvailableViewsPortalComponent } from './lab-resource-available-views-portal.component';

describe('LabResourceViewSpecsListVComponent', () => {
  let component: LabResourceAvailableViewsPortalComponent;
  let fixture: ComponentFixture<LabResourceAvailableViewsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceAvailableViewsPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceAvailableViewsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
