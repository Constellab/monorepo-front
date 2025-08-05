import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiMonitorBetweenDatesDialogComponent } from './li-monitor-between-dates-dialog.component';

describe('LiMonitorBetweenDatesDialogComponent', () => {
  let component: LiMonitorBetweenDatesDialogComponent;
  let fixture: ComponentFixture<LiMonitorBetweenDatesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiMonitorBetweenDatesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiMonitorBetweenDatesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
