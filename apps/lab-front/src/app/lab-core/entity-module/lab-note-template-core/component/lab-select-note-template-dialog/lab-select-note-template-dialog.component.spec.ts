import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectNoteTemplateDialogComponent } from './lab-select-note-template-dialog.component';

describe('LabSelectNoteTemplateDialogComponent', () => {
  let component: LabSelectNoteTemplateDialogComponent;
  let fixture: ComponentFixture<LabSelectNoteTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectNoteTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectNoteTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
