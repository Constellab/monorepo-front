import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiProgressBarInfoComponent } from './li-progress-bar-info.component';

describe('BioxWorkflowNodeProgressComponent', () => {
  let component: LiProgressBarInfoComponent;
  let fixture: ComponentFixture<LiProgressBarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiProgressBarInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiProgressBarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
