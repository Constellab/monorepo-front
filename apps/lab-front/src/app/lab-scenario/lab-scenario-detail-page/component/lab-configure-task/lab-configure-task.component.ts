import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { LabConfigureSpecsFormComponent } from '../../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { LabProcessDashboardState } from '../../state/lab-process-dashboard.state';
import { LabConfig } from '../../../../lab-core/model/entities/lab-config.entity';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import { Observable, Subscription } from 'rxjs';
import { LabTask } from '../../../../lab-core/model/entities/process/lab-task.entity';

@Component({
  selector: 'lab-configure-task',
  templateUrl: './lab-configure-task.component.html',
  styleUrls: ['./lab-configure-task.component.scss'],
})
export class LabConfigureTaskComponent implements OnInit, OnDestroy {
  @Input() task: LabProcess;

  @Input() onCodeShownTrigger: Observable<void>;

  formGp: UntypedFormGroup;
  processConfig: LabConfig;

  showCodeSubscription: Subscription;

  constructor(
    private dashboardState: LabProcessDashboardState,
    private nodeState: LabWorkflowNodeDetailState
  ) {}

  ngOnInit(): void {
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.task.config);
    this.dashboardState.setCurrentTask(this.task, this.formGp);
    this.processConfig = LabConfig.fromSpecs(this.task.config.specs, this.task.config.values);
    this.showCodeSubscription = this.onCodeShownTrigger.subscribe(() => {
      this.changeCodeVisibility();
    });
  }

  submit(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

  reInitFormGp(config: LabConfig): void {
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(config);
    this.task.config.specs['params'] = config.specs['params'];
    this.processConfig = LabConfig.fromSpecs(config.specs, config.values);
    this.dashboardState.setCurrentTask(this.task, this.formGp);
    this.nodeState.updateProcess(this.task);
  }

  private changeCodeVisibility(): void {
    this.nodeState.updateProcessCodeParamsVisibility(this.task).subscribe((task: LabTask) => {
      this.task = task;
      this.reInitFormGp(LabConfig.fromSpecs(task.config.specs, task.config.values));
    });
  }

  ngOnDestroy(): void {
    this.showCodeSubscription?.unsubscribe();
  }
}
