import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitoringAppDetailComponent } from './lab-monitoring-app-detail.component';

describe('LabMonitoringAppDetailComponent', () => {
  let component: LabMonitoringAppDetailComponent;
  let fixture: ComponentFixture<LabMonitoringAppDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabMonitoringAppDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringAppDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
