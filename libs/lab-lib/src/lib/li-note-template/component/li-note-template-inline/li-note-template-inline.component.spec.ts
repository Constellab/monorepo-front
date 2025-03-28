import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNoteTemplateInlineComponent } from './li-note-template-inline.component';

describe('LiNoteTemplateInlineComponent', () => {
  let component: LiNoteTemplateInlineComponent;
  let fixture: ComponentFixture<LiNoteTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteTemplateInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNoteTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
