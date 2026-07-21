import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiNoteService, LiNoteTemplate } from '@monorepo/lab-lib/li-core';
import { LiSelectNoteTemplateComponent } from '@monorepo/lab-lib/li-note-template';
import { TeRichText, TeRichTextDTO } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    LiSelectNoteTemplateComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabNoteInsertTemplateDialogComponent {
  formControl: FormControl<LiNoteTemplate> = new FormControl();
  isLoading: boolean = false;

  private dialogInput: LabNoteInsertTemplateDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private noteService = inject(LiNoteService);

  submit(): void {
    if (!this.isLoading && this.formControl.valid) {
      this.insertTemplate(this.formControl.value);
    }
  }

  private insertTemplate(noteTemplate: LiNoteTemplate): void {
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
