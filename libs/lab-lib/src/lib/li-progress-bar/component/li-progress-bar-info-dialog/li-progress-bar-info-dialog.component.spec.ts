import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiProgressBarInfoDialogComponent } from './li-progress-bar-info-dialog.component';

describe('BioxProgressBarInfoDialogComponent', () => {
  let component: LiProgressBarInfoDialogComponent;
  let fixture: ComponentFixture<LiProgressBarInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiProgressBarInfoDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiProgressBarInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
