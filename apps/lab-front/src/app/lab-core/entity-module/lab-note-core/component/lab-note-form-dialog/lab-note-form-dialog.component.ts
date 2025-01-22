import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { LabNote, LabNoteForm } from '../../../../model/entities/lab-note.entity';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabEntity } from '../../../../model/global/lab-entity.entity';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectNoteTemplateComponent } from '../../../lab-note-template-core/component/lab-select-note-template/lab-select-note-template.component';
import { LabFolderSelectComponent } from '../../../lab-folder-core/component/lab-folder-select/lab-folder-select.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabNoteFormDialogInput extends FlFormDialogInput<LabNoteForm> {
  noteId?: string;
  scenarioId?: string; // can be provided during create to link the note directly to a scenario
  folder?: LabEntity;
  disableFolder?: boolean;
}

@Component({
  selector: 'lab-note-form-dialog',
  templateUrl: './lab-note-form-dialog.component.html',
  styleUrls: ['./lab-note-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    FlFormModule,
    LabSelectNoteTemplateComponent,
    LabFolderSelectComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabNoteFormDialogComponent
  extends FlFormDialogAbstractDirective<LabNoteForm, LabNote>
  implements OnInit
{
  private noteService = inject(LabNoteService);

  dialogInput: LabNoteFormDialogInput = inject(MAT_DIALOG_DATA);

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
    const formGroup = new FormBuilder().group({
      title: [null, Validators.required],
      folder: [
        { value: this.dialogInput.folder, disabled: this.isCreateMode() && this.dialogInput.folder != null },
      ],
      template: [{ value: null, disabled: this.isUpdateMode() }],
    });

    if (this.dialogInput.disableFolder) {
      formGroup.get('folder').disable();
    }

    return formGroup;
  }

  create(formValue: LabNoteForm): Observable<LabNote> {
    if (this.dialogInput.scenarioId) {
      return this.noteService.createForScenario(formValue, this.dialogInput.scenarioId);
    } else {
      return this.noteService.create(formValue);
    }
  }

  update(formValue: LabNoteForm): Observable<LabNote> {
    return this.noteService.update(this.dialogInput.noteId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'biox.note_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.note_updated';
  }

  onTemplateSelected(template: LabNoteTemplate): void {
    if (!this.formGp.value.title) {
      this.formGp.patchValue({ title: template.title });
    }
  }
}
