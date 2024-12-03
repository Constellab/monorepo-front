import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LabProcessDashboardState } from '../../state/lab-process-dashboard.state';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import { Subscription } from 'rxjs';
import { LabTask } from '../../../../lab-core/model/entities/process/lab-task.entity';
import { TdParamSpecVisibility } from '@monorepo/technical-doc';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss'],
})
export class LabConfigureTaskComponent implements OnInit, OnDestroy {
  @Input() task: LabProcess;

  formGp = this.dashboardState.getTaskFormGp();
  processConfig = this.dashboardState.getTaskConfig();

  changeCommunityAgentVisibilitySubscription: Subscription;

  constructor(
    private dashboardState: LabProcessDashboardState,
    private nodeState: LabWorkflowNodeDetailState
  ) {}

  ngOnInit(): void {
    this.dashboardState.setCurrentTask(this.task, this.task.config);
    this.changeCommunityAgentVisibilitySubscription =
      this.dashboardState.changeCommunityAgentVisibilityEvent.subscribe(
        (visibility: TdParamSpecVisibility) => {
          this.changeCodeVisibility(visibility);
        }
      );
  }

  submit(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

  private changeCodeVisibility(visibility: TdParamSpecVisibility): void {
    this.nodeState
      .updateCommunityAgentCodeParamsVisibility(this.task, visibility)
      .subscribe((task: LabTask) => {
        if (task) {
          this.task = task;
          this.dashboardState.setCurrentTask(this.task, this.task.config);
          this.dashboardState.onCommunityAgentVisibilityChanged.emit(visibility);
        }
      });
  }

  ngOnDestroy(): void {
    this.changeCommunityAgentVisibilitySubscription?.unsubscribe();
  }
}
