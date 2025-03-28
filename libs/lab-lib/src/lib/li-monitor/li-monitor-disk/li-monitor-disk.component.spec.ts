import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiMonitorDiskComponent } from './li-monitor-disk.component';

describe('LiMonitorDiskComponent', () => {
  let component: LiMonitorDiskComponent;
  let fixture: ComponentFixture<LiMonitorDiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiMonitorDiskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiMonitorDiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
