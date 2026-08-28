import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiEntity, LiNote, LiNoteForm, LiNoteService, LiNoteTemplate } from '@monorepo/lab-lib/li-core';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiSelectNoteTemplateComponent } from '@monorepo/lab-lib/li-note-template';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface LiNoteFormDialogInput extends FlFormDialogInput<LiNoteForm> {
  noteId?: string;
  scenarioId?: string; // can be provided during create to link the note directly to a scenario
  folder?: LiEntity;
  template?: LiNoteTemplate; // preselect a template during create
}

@Component({
  selector: 'li-note-form-dialog',
  templateUrl: './li-note-form-dialog.component.html',
  styleUrls: ['./li-note-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    FlFormModule,
    LiSelectNoteTemplateComponent,
    LiFolderSelectComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiNoteFormDialogComponent
  extends FlFormDialogAbstractDirective<LiNoteForm, LiNote>
  implements OnInit
{
  private noteService = inject(LiNoteService);

  dialogInput: LiNoteFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'li.create_note' : 'li.update_note';
  }

  buildForm(): UntypedFormGroup {
    const template = this.dialogInput.template ?? null;
    return new FormBuilder().group({
      title: [template?.title ?? null, Validators.required],
      folder: [
        { value: this.dialogInput.folder, disabled: this.isCreateMode() && this.dialogInput.folder != null },
      ],
      template: [{ value: template, disabled: this.isUpdateMode() || template != null }],
    });
  }

  create(formValue: LiNoteForm): Observable<LiNote> {
    if (this.dialogInput.scenarioId) {
      return this.noteService.createForScenario(formValue, this.dialogInput.scenarioId);
    } else {
      return this.noteService.create(formValue);
    }
  }

  update(formValue: LiNoteForm): Observable<LiNote> {
    const noteId = this.dialogInput.noteId;
    if (!noteId) {
      throw new Error('[LiNoteFormDialogComponent] Missing note id in update mode');
    }

    return this.noteService.update(noteId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'li.note_created';
  }

  getUpdateSuccessMessage(): string {
    return 'li.note_updated';
  }

  onTemplateSelected(template: LiNoteTemplate | null): void {
    if (template && !this.formGp.value.title) {
      this.formGp.patchValue({ title: template.title });
    }
  }
}
