import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LabNoteTemplate } from '../../../../../lab-core/model/entities/lab-note-template.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { TeRichText, TeRichTextDTO } from '@monorepo/text-editor';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectNoteTemplateComponent } from '../../../../../lab-core/entity-module/lab-note-template-core/component/lab-select-note-template/lab-select-note-template.component';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    LabSelectNoteTemplateComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
