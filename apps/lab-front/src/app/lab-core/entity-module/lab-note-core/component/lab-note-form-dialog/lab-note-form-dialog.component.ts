import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { LabNote, LabNoteForm } from '../../../../model/entities/lab-note.entity';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabEntity } from '../../../../model/global/lab-entity.entity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabDocumentTemplate } from '../../../../model/entities/lab-document-template.entity';

export interface LabNoteFormDialogInput extends FlFormDialogInput<LabNoteForm> {
  noteId?: string;
  scenarioId?: string; // can be provided during create to link the note directly to an scenario
  folder?: LabEntity;
  disableFolder?: boolean;
}

@Component({
  selector: 'lab-note-form-dialog',
  templateUrl: './lab-note-form-dialog.component.html',
  styleUrls: ['./lab-note-form-dialog.component.scss']
})
export class LabNoteFormDialogComponent extends FlFormDialogAbstractDirective<LabNoteForm, LabNote> implements OnInit {

  dialogInput: LabNoteFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private noteService: LabNoteService) {
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
      folder: [{value: this.dialogInput.folder, disabled: this.isCreateMode() && this.dialogInput.folder != null}],
      template: [{value: null, disabled: this.isUpdateMode()}]
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

  onTemplateSelected(template: LabDocumentTemplate): void {
    if (!this.formGp.value.title) {
      this.formGp.patchValue({title: template.title});
    }
  }


}
