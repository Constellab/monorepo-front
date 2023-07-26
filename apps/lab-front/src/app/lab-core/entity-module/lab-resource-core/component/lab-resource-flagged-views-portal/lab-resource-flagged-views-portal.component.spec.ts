import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabResourceFlaggedViewsPortalComponent} from './lab-resource-flagged-views-portal.component';

describe('LabResourceFlaggedViewsPortalComponent', () => {
  let component: LabResourceFlaggedViewsPortalComponent;
  let fixture: ComponentFixture<LabResourceFlaggedViewsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceFlaggedViewsPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceFlaggedViewsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
