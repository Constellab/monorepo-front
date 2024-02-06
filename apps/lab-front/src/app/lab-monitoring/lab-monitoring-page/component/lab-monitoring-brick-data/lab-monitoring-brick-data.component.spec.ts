import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabMonitoringBrickDataComponent} from './lab-monitoring-brick-data.component';

describe('LabBrickDataPageComponent', () => {
  let component: LabMonitoringBrickDataComponent;
  let fixture: ComponentFixture<LabMonitoringBrickDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabMonitoringBrickDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabMonitoringBrickDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
