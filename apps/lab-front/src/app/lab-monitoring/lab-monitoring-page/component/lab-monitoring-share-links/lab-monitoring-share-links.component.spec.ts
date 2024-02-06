import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabMonitoringShareLinksComponent} from './lab-monitoring-share-links.component';

describe('LabMonitoringShareLinksPageComponent', () => {
  let component: LabMonitoringShareLinksComponent;
  let fixture: ComponentFixture<LabMonitoringShareLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabMonitoringShareLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabMonitoringShareLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
