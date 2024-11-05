import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitoringCredentialsPageComponent } from './lab-monitoring-credentials-page.component';

describe('LabMonitoringCredentialsPageComponent', () => {
  let component: LabMonitoringCredentialsPageComponent;
  let fixture: ComponentFixture<LabMonitoringCredentialsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringCredentialsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitoringCredentialsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
