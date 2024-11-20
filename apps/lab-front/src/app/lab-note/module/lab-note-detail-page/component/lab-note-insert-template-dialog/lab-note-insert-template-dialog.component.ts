import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { LabNoteTemplate } from '../../../../../lab-core/model/entities/lab-note-template.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { TeRichText, TeRichTextDTO } from '@monorepo/text-editor';

export interface LabNoteInsertTemplateDialogData {
  noteId: string;
  blockIndex: number;
}

/**
 * Dialog to insert a note template in the note
 */
@Component({
  selector: 'lab-note-insert-template-dialog',
  templateUrl: './lab-note-insert-template-dialog.component.html',
  styleUrl: './lab-note-insert-template-dialog.component.scss',
})
export class LabNoteInsertTemplateDialogComponent {
  formControl: FormControl<LabNoteTemplate> = new FormControl();
  isLoading: boolean = false;

  private dialogInput: LabNoteInsertTemplateDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private noteService = inject(LabNoteService);

  submit(): void {
    if (!this.isLoading && this.formControl.valid) {
      this.insertTemplate(this.formControl.value);
    }
  }

  private insertTemplate(noteTemplate: LabNoteTemplate): void {
    this.isLoading = true;
    this.noteService
      .insertNoteTemplate(this.dialogInput.noteId, {
        block_index: this.dialogInput.blockIndex.toString(),
        note_template_id: noteTemplate.id,
      })
      .subscribe({
        next: (content) => this.insertTemplateSuccess(content),
        error: () => (this.isLoading = false),
      });
  }

  private insertTemplateSuccess(content: TeRichTextDTO): void {
    this.isLoading = false;
    this.dialogRef.close(new TeRichText(content));
  }
}
