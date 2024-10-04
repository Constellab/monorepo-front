import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { LabDocumentTemplate } from '../../../../../lab-core/model/entities/lab-document-template.entity';
import { LabNoteContent } from '../../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';

export interface LabNoteInsertTemplateDialogData {
  noteId: string;
  blockIndex: number;
}

/**
 * Dialog to insert a document template in the note
 */
@Component({
  selector: 'lab-note-insert-template-dialog',
  templateUrl: './lab-note-insert-template-dialog.component.html',
  styleUrl: './lab-note-insert-template-dialog.component.scss'
})
export class LabNoteInsertTemplateDialogComponent {

  formControl: FormControl<LabDocumentTemplate> = new FormControl();
  isLoading: boolean = false;

  private dialogInput: LabNoteInsertTemplateDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private noteService = inject(LabNoteService);


  submit(): void {
    if (!this.isLoading && this.formControl.valid) {
      this.insertTemplate(this.formControl.value);
    }
  }

  private insertTemplate(documentTemplate: LabDocumentTemplate): void {
    this.isLoading = true;
    this.noteService.insertDocumentTemplate(this.dialogInput.noteId, {
      block_index: this.dialogInput.blockIndex.toString(),
      document_template_id: documentTemplate.id
    }).subscribe({
      next: content => this.insertTemplateSuccess(content),
      error: () => this.isLoading = false
    });
  }

  private insertTemplateSuccess(content: LabNoteContent): void {
    this.isLoading = false;
    this.dialogRef.close(content);
  }
}
