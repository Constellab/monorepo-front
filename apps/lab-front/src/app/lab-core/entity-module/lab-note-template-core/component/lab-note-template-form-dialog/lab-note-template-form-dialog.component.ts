import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabNoteTemplate, LabNoteTemplateForm } from '../../../../model/entities/lab-note-template.entity';
import { LabNoteTemplateService } from '../../../../entity-service/lab-note-template.service';

@Component({
    selector: 'lab-note-template-form-dialog',
    templateUrl: './lab-note-template-form-dialog.component.html',
    styleUrl: './lab-note-template-form-dialog.component.scss',
    standalone: false
})
export class LabNoteTemplateFormDialogComponent
  extends FlFormDialogAbstractDirective<LabNoteTemplateForm, LabNoteTemplate>
  implements OnInit
{
  constructor(private noteTemplateService: LabNoteTemplateService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_note_template' : '';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null as string, Validators.required],
    });
  }

  create(formValue: LabNoteTemplateForm): Observable<LabNoteTemplate> {
    return this.noteTemplateService.createEmpty(formValue);
  }

  update(): Observable<LabNoteTemplate> {
    throw new Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'biox.note_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
