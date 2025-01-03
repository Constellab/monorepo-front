import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { LabProcessDashboardState } from '../../state/lab-process-dashboard.state';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib';
import { LabProcessDashboardDynamicFieldConfig } from '../../../../lab-core/entity-module/lab-config-core/lab-process-dynamic-field-config.service';
import { TdAbstractDynamicParamSpecState } from '@monorepo/technical-doc';
import { LabDynamicParamSpecState } from '../../../../lab-core/entity-module/lab-config-core/state/lab-dynamic-param-spec.state';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    // enable dynamic config
    { provide: FlDynamicFieldConfigService, useClass: LabProcessDashboardDynamicFieldConfig },
    // configure the dynamic param spec state for dynamic config
    { provide: TdAbstractDynamicParamSpecState, useClass: LabDynamicParamSpecState },
  ],
})
export class LabConfigureTaskComponent implements OnInit, OnDestroy {
  @Input({ required: true }) task: LabProcess;

  private dashboardState = inject(LabProcessDashboardState);

  private editDynamicParamSpecState: LabDynamicParamSpecState = inject(
    TdAbstractDynamicParamSpecState
  ) as LabDynamicParamSpecState;

  formGp = this.dashboardState.getTaskFormGp();
  processConfig = this.dashboardState.getTaskConfig();

  ngOnInit(): void {
    this.dashboardState.setCurrentTask(this.task.parentProtocolId, this.task.instanceName, this.task.config);
    this.editDynamicParamSpecState.setProcess(this.task);
  }

  submit(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

  ngOnDestroy(): void {
    this.dashboardState.clearTask();
  }
}
