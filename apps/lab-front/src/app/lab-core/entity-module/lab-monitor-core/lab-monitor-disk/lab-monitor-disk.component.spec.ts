import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitorDiskComponent } from './lab-monitor-disk.component';

describe('LabMonitorDiskComponent', () => {
  let component: LabMonitorDiskComponent;
  let fixture: ComponentFixture<LabMonitorDiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabMonitorDiskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitorDiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
