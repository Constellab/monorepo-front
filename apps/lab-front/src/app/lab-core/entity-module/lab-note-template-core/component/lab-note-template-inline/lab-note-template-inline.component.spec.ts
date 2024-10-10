import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNoteTemplateInlineComponent } from './lab-note-template-inline.component';

describe('LabNoteTemplateInlineComponent', () => {
  let component: LabNoteTemplateInlineComponent;
  let fixture: ComponentFixture<LabNoteTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplateInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
