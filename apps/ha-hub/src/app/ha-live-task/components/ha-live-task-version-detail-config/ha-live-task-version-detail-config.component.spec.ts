import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaLiveTaskVersionDetailConfigComponent } from './ha-live-task-version-detail-config.component';

describe('HaLiveTaskVersionDetailConfigComponent', () => {
  let component: HaLiveTaskVersionDetailConfigComponent;
  let fixture: ComponentFixture<HaLiveTaskVersionDetailConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaLiveTaskVersionDetailConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaLiveTaskVersionDetailConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
