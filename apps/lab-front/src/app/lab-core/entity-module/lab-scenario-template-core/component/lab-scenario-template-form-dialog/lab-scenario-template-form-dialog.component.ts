import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  LabCreateScenarioTemplateDTO,
  LabScenarioTemplate,
} from '../../../../model/entities/process/lab-scenario-template.entity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { LabScenarioTemplateService } from '../../../../entity-service/lab-scenario-template.service';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';

export interface LabScenarioTemplateFormDialogInput extends FlFormDialogInput<LabScenarioTemplate> {
  protocolId?: string;
  defaultName?: string;
  defaultDescription?: TeRichText;
}

@Component({
  selector: 'lab-scenario-template-form-dialog',
  templateUrl: './lab-scenario-template-form-dialog.component.html',
  styleUrls: ['./lab-scenario-template-form-dialog.component.scss'],
})
export class LabScenarioTemplateFormDialogComponent
  extends FlFormDialogAbstractDirective<LabCreateScenarioTemplateDTO, LabScenarioTemplate>
  implements OnInit
{
  dialogInput: LabScenarioTemplateFormDialogInput = inject(MAT_DIALOG_DATA);

  textEditorConfig: TeBasicConfig = new TeBasicConfig({ includeToolbarButton: true });

  constructor(
    private protocolService: LabProtocolService,
    private scenarioTemplateService: LabScenarioTemplateService
  ) {
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

  create(formValue: LabCreateScenarioTemplateDTO): Observable<LabScenarioTemplate> {
    return this.protocolService.createScenarioTemplate(this.dialogInput.protocolId, formValue);
  }

  update(formValue: LabCreateScenarioTemplateDTO): Observable<LabScenarioTemplate> {
    return this.scenarioTemplateService.updateScenarioTemplate(this.dialogInput.object.id, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_scenario_template' : 'biox.update_scenario_template';
  }

  getCreateSuccessMessage(): string {
    return 'biox.scenario_template_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.scenario_template_updated';
  }
}
