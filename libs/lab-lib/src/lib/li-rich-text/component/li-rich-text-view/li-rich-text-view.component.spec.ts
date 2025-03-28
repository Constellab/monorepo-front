import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiRichTextViewComponent } from './li-rich-text-view.component';

describe('LabNoteContentViewComponent', () => {
  let component: LiRichTextViewComponent;
  let fixture: ComponentFixture<LiRichTextViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiRichTextViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiRichTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
