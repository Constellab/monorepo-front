import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  LabCreateProtocolTemplateDTO,
  LabProtocolTemplate
} from '../../../../model/entities/process/lab-protocol-template.entity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { LabProtocolTemplateService } from '../../../../entity-service/lab-protocol-template.service';
import { TeBasicConfig, TeRichTextContent } from '@monorepo/text-editor';

export interface LabProtocolTemplateFormDialogInput extends FlFormDialogInput<LabProtocolTemplate> {
  protocolId?: string;
  defaultName?: string;
  defaultDescription?: TeRichTextContent;
}

@Component({
  selector: 'lab-protocol-template-form-dialog',
  templateUrl: './lab-protocol-template-form-dialog.component.html',
  styleUrls: ['./lab-protocol-template-form-dialog.component.scss'],
})
export class LabProtocolTemplateFormDialogComponent extends FlFormDialogAbstractDirective<LabCreateProtocolTemplateDTO>
  implements OnInit {
  dialogInput: LabProtocolTemplateFormDialogInput = inject(MAT_DIALOG_DATA);

  textEditorConfig: TeBasicConfig = new TeBasicConfig({includeToolbarButton: true});

  constructor(private protocolService: LabProtocolService,
              private protocolTemplateService: LabProtocolTemplateService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
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
