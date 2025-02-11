import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitoringCurrentInfoComponent } from './lab-monitoring-current-info.component';

describe('LabMonitoringCurrentInfoComponent', () => {
  let component: LabMonitoringCurrentInfoComponent;
  let fixture: ComponentFixture<LabMonitoringCurrentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabMonitoringCurrentInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringCurrentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
