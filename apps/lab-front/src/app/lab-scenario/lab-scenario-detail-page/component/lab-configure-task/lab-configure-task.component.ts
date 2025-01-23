import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { TdAbstractDynamicParamSpecState } from '@monorepo/technical-doc';
import { LabDynamicParamSpecState } from '../../../../lab-core/entity-module/lab-config-core/state/lab-dynamic-param-spec.state';
import { ReactiveFormsModule } from '@angular/forms';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { LabConfigureSpecsFormComponent } from '../../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss'],
  imports: [ReactiveFormsModule, FlCoreComponentModule, LabConfigureSpecsFormComponent, TranslatePipe],
})
export class LabConfigureTaskComponent implements OnInit, OnDestroy {
  @Input({ required: true }) task: LabProcess;

  private dashboardState = inject(LabProcessDashboardConfigState);

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
