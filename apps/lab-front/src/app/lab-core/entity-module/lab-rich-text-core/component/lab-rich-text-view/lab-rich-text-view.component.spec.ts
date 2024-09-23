import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabRichTextViewComponent } from './lab-rich-text-view.component';

describe('LabNoteContentViewComponent', () => {
  let component: LabRichTextViewComponent;
  let fixture: ComponentFixture<LabRichTextViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabRichTextViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabRichTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
