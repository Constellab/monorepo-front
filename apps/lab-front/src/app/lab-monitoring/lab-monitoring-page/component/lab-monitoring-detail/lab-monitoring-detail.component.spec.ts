import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitoringDetailComponent } from './lab-monitoring-detail.component';

describe('LabMonitoringDetailComponent', () => {
  let component: LabMonitoringDetailComponent;
  let fixture: ComponentFixture<LabMonitoringDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabMonitoringDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
