import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabMonitoringStreamlitStatusComponent} from './lab-monitoring-streamlit-status.component';

describe('LabMonitoringStreamlitStatusComponent', () => {
  let component: LabMonitoringStreamlitStatusComponent;
  let fixture: ComponentFixture<LabMonitoringStreamlitStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringStreamlitStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabMonitoringStreamlitStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
