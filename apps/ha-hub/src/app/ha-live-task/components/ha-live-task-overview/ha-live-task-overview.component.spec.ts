import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaLiveTaskOverviewComponent } from './ha-live-task-overview.component';

describe('HaLiveTaskOverviewComponent', () => {
  let component: HaLiveTaskOverviewComponent;
  let fixture: ComponentFixture<HaLiveTaskOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaLiveTaskOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaLiveTaskOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
