import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabMonitoringActivityPageComponent} from './lab-monitoring-activity-page.component';

describe('LabMonitoringActivityComponent', () => {
  let component: LabMonitoringActivityPageComponent;
  let fixture: ComponentFixture<LabMonitoringActivityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringActivityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringActivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
