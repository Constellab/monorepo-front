import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaLiveTaskVersionsComponent } from './ha-live-task-versions.component';

describe('HaLiveTaskVersionsComponent', () => {
  let component: HaLiveTaskVersionsComponent;
  let fixture: ComponentFixture<HaLiveTaskVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaLiveTaskVersionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaLiveTaskVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
