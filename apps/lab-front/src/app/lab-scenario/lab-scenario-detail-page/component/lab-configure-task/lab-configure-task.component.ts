import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  LabConfigureSpecsFormComponent
} from '../../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { LabProcessDashboardState } from '../../state/lab-process-dashboard.state';
import { LabConfig } from '../../../../lab-core/model/entities/lab-config.entity';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss']
})
export class LabConfigureTaskComponent implements OnInit {

  @Input() task: LabProcess;

  formGp: UntypedFormGroup;
  processConfig: LabConfig;

  constructor(private dashboardState: LabProcessDashboardState) {
  }

  ngOnInit(): void {
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.task.config);
    this.dashboardState.setCurrentTask(this.task, this.formGp);
    this.processConfig = LabConfig.fromSpecs(this.task.config.specs, this.task.config.values);
  }

  submit(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

}
