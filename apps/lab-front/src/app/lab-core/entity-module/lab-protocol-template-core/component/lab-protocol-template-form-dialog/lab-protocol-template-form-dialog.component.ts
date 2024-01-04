import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {
  LabCreateProtocolTemplateDTO,
  LabProtocolTemplate
} from '../../../../model/entities/process/lab-protocol-template.entity';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {LabProtocolService} from '../../../../entity-service/lab-protocol.service';
import {LabProtocolTemplateService} from '../../../../entity-service/lab-protocol-template.service';
import {TeBasicConfig, TeTextEditorContent} from '@monorepo/text-editor';

export interface LabProtocolTemplateFormDialogInput extends FlFormDialogInput<LabProtocolTemplate> {
  protocolId?: string;
  defaultName?: string;
  defaultDescription?: TeTextEditorContent;
}

@Component({
  selector: 'lab-protocol-template-form-dialog',
  templateUrl: './lab-protocol-template-form-dialog.component.html',
  styleUrls: ['./lab-protocol-template-form-dialog.component.scss'],
})
export class LabProtocolTemplateFormDialogComponent extends FlFormDialogAbstractDirective<LabCreateProtocolTemplateDTO>
  implements OnInit {

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  constructor(@Inject(MAT_DIALOG_DATA) protected dialogInput: LabProtocolTemplateFormDialogInput,
              private protocolService: LabProtocolService,
              private protocolTemplateService: LabProtocolTemplateService,
              snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<LabProtocolTemplateFormDialogComponent>) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<LabCreateProtocolTemplateDTO> {
    return new FormBuilder().group({
      name: [this.dialogInput.defaultName, Validators.required],
      description: [this.dialogInput.defaultDescription],
    });
  }

  create(formValue: LabCreateProtocolTemplateDTO): Observable<LabCreateProtocolTemplateDTO> {
    return this.protocolService.createProtocolTemplate(this.dialogInput.protocolId, formValue);
  }

  update(formValue: LabCreateProtocolTemplateDTO): Observable<LabCreateProtocolTemplateDTO> {
    return this.protocolTemplateService.updateProtocolTemplate(this.dialogInput.object.id, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_protocol_template' : 'biox.update_protocol_template';
  }

  getCreateSuccessMessage(): string {
    return 'biox.protocol_template_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.protocol_template_updated';
  }

}
