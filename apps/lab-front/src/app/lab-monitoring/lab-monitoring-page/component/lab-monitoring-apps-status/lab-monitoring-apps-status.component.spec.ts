import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitoringAppsStatusComponent } from './lab-monitoring-apps-status.component';

describe('LabMonitoringAppsStatusComponent', () => {
  let component: LabMonitoringAppsStatusComponent;
  let fixture: ComponentFixture<LabMonitoringAppsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringAppsStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringAppsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
