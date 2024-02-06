import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabMonitoringOtherPageComponent} from './lab-monitoring-other-page.component';

describe('LabMonitoringOtherPageComponent', () => {
  let component: LabMonitoringOtherPageComponent;
  let fixture: ComponentFixture<LabMonitoringOtherPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabMonitoringOtherPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabMonitoringOtherPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
