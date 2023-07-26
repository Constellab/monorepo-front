import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabResourceViewSpecsListPortalComponent} from './lab-resource-view-specs-list-portal.component';

describe('LabResourceViewSpecsListVComponent', () => {
  let component: LabResourceViewSpecsListPortalComponent;
  let fixture: ComponentFixture<LabResourceViewSpecsListPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceViewSpecsListPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceViewSpecsListPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
