import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaLiveTaskCommentsComponent } from './ha-live-task-comments.component';

describe('HaLiveTaskCommentsComponent', () => {
  let component: HaLiveTaskCommentsComponent;
  let fixture: ComponentFixture<HaLiveTaskCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaLiveTaskCommentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaLiveTaskCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
