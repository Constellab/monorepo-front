import {Component, Input, OnInit} from '@angular/core';
import {LabProcess} from '../../../../../lab-core/model/entities/process/lab-process.entity';
import {UntypedFormGroup} from '@angular/forms';
import {LabConfigureSpecsForm} from '../../../../../lab-core/model/entities/lab-config.entity';
import {
  LabConfigureSpecsFormComponent
} from '../../../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import {LabWorkflowEditConfig} from '../../model/lab-workflow-edit-config.class';
import {FlDynamicFieldConfigService, FlFormHelper} from '@monorepo/front-core-lib';
import {
  LabConfigureProcessDynamicField
} from '../../../../../lab-core/entity-module/lab-config-core/lab-configure-process-dynamic-field.service';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    {provide: FlDynamicFieldConfigService, useClass: LabConfigureProcessDynamicField}
  ]
})
export class LabConfigureTaskComponent implements OnInit {

  @Input() task: LabProcess;

  formGp: UntypedFormGroup = new UntypedFormGroup({});


  constructor(private workflowEditConfig: LabWorkflowEditConfig) {
  }

  ngOnInit(): void {
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.task.config);
  }

  submit(): void {
    if (this.formGp.valid) {
      this.saveConfig(this.formGp.getRawValue());
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private saveConfig(config: LabConfigureSpecsForm): void {
    const configValue = {...config.public, ...config.protected};
    this.workflowEditConfig.updateProcessConfig(this.task.parentProtocolId, this.task.instanceName, configValue);
  }

}
