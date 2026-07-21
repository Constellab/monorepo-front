import { ChangeDetectionStrategy,Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { LiProcess } from '@monorepo/lab-lib/li-core';
import { TdAbstractDynamicParamSpecState, TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LabDynamicParamSpecState } from '../../state/lab-dynamic-param-spec.state';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, FlCoreComponentModule, TranslatePipe, TdTechnicalDocModule],
})
export class LabConfigureTaskComponent implements OnInit, OnDestroy {
  @Input({ required: true }) task: LiProcess;

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
