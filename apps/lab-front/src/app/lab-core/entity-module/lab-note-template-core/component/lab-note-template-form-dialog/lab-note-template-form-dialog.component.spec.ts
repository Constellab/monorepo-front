import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNoteTemplateFormDialogComponent } from './lab-note-template-form-dialog.component';

describe('LabNoteTemplateFormDialogComponent', () => {
  let component: LabNoteTemplateFormDialogComponent;
  let fixture: ComponentFixture<LabNoteTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
