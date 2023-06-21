import {Component, Input, OnInit} from '@angular/core';
import {LabProcess} from '../../../../../lab-core/model/entities/process/lab-process.entity';
import {UntypedFormGroup} from '@angular/forms';
import {
  LabConfigureSpecsFormComponent
} from '../../../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import {FlDynamicFieldConfigService} from '@monorepo/front-core-lib';
import {
  LabConfigureProcessDynamicField
} from '../../../../../lab-core/entity-module/lab-config-core/lab-configure-process-dynamic-field.service';
import {LabWorkflowNodeDashboardState} from '../../state/lab-workflow-node-dashboard.state';

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

  formGp: UntypedFormGroup;

  constructor(private dashboardState: LabWorkflowNodeDashboardState) {
  }

  ngOnInit(): void {
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.task.config);
    this.dashboardState.setCurrentTask(this.task, this.formGp);
  }

  submit(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

}
