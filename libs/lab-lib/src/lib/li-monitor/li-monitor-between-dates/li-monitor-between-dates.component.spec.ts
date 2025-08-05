import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiMonitorBetweenDatesComponent } from './li-monitor-between-dates.component';

describe('LiMonitorBetweenDatesComponent', () => {
  let component: LiMonitorBetweenDatesComponent;
  let fixture: ComponentFixture<LiMonitorBetweenDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiMonitorBetweenDatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiMonitorBetweenDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
