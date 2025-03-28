import { Component, OnInit, inject } from '@angular/core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { LiEntity, LiNote, LiNoteForm, LiNoteService, LiNoteTemplate } from '@monorepo/lab-lib/li-core';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { LiSelectNoteTemplateComponent } from '@monorepo/lab-lib/li-note-template';

export interface LiNoteFormDialogInput extends FlFormDialogInput<LiNoteForm> {
  noteId?: string;
  scenarioId?: string; // can be provided during create to link the note directly to a scenario
  folder?: LiEntity;
}

@Component({
  selector: 'li-note-form-dialog',
  templateUrl: './li-note-form-dialog.component.html',
  styleUrls: ['./li-note-form-dialog.component.scss'],
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
    return this.isCreateMode() ? 'biox.create_note' : 'biox.update_note';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null, Validators.required],
      folder: [
        { value: this.dialogInput.folder, disabled: this.isCreateMode() && this.dialogInput.folder != null },
      ],
      template: [{ value: null, disabled: this.isUpdateMode() }],
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
    return this.noteService.update(this.dialogInput.noteId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'biox.note_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.note_updated';
  }

  onTemplateSelected(template: LiNoteTemplate): void {
    if (!this.formGp.value.title) {
      this.formGp.patchValue({ title: template.title });
    }
  }
}
