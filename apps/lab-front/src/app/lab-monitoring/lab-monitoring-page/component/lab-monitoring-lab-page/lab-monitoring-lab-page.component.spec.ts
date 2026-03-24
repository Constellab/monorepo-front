import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitoringLabPageComponent } from './lab-monitoring-lab-page.component';

describe('LabMonitoringLabPageComponent', () => {
  let component: LabMonitoringLabPageComponent;
  let fixture: ComponentFixture<LabMonitoringLabPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringLabPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringLabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
