import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabDocumentTemplate, LabDocumentTemplateForm } from '../../../../model/entities/lab-document-template.entity';
import { LabDocumentTemplateService } from '../../../../entity-service/lab-document-template.service';

@Component({
  selector: 'lab-document-template-form-dialog',
  templateUrl: './lab-document-template-form-dialog.component.html',
  styleUrl: './lab-document-template-form-dialog.component.scss',
})
export class LabDocumentTemplateFormDialogComponent extends FlFormDialogAbstractDirective<LabDocumentTemplateForm, LabDocumentTemplate>
  implements OnInit {

  constructor(private documentTemplateService: LabDocumentTemplateService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_document_template' : '';
  }

  buildForm(): FormGroup<LabDocumentTemplateForm> {
    return new FormBuilder().group({
      title: [null, Validators.required],
    });
  }

  create(formValue: LabDocumentTemplateForm): Observable<LabDocumentTemplate> {
    return this.documentTemplateService.createEmpty(formValue);
  }

  update(): Observable<LabDocumentTemplate> {
    throw new Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'biox.note_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
