import { EventEmitter, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { LabWorkflowEditConfig } from '../model/lab-workflow-edit-config.class';
import { UntypedFormGroup } from '@angular/forms';
import { FlFormHelper, FlPortalActionResult } from '@monorepo/front-core-lib';
import { LabConfig, LabConfigureSpecsForm } from '../../../lab-core/model/entities/lab-config.entity';
import { Observable, of } from 'rxjs';
import { prConfigValueAreEqual, PrConfigValues } from '@monorepo/protocol';
import { LabProcess } from '../../../lab-core/model/entities/process/lab-process.entity';
import { TdConfig, TdParamSpecVisibility } from '@monorepo/technical-doc';
import {
  LabConfigureSpecsFormComponent
} from '../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { LabWorkflowNodeDetailState } from './lab-workflow-node-detail.state';

/**
 * State for the process dashboard
 */
@Injectable()
export class LabProcessDashboardState {
  private nodeState: LabWorkflowNodeDetailState;

  private task: LabProcess;
  private taskFormGp: WritableSignal<UntypedFormGroup> = signal<UntypedFormGroup>(null);
  private taskConfig: WritableSignal<LabConfig> = signal<LabConfig>(null);

  changeCommunityAgentVisibilityEvent: EventEmitter<TdParamSpecVisibility> = new EventEmitter();
  onCommunityAgentVisibilityChanged: EventEmitter<TdParamSpecVisibility> = new EventEmitter();

  constructor(private workflowEditConfig: LabWorkflowEditConfig) {}

  public init(nodeState: LabWorkflowNodeDetailState): void {
    this.nodeState = nodeState;
  }

  public getTaskFormGp(): Signal<UntypedFormGroup> {
    return this.taskFormGp;
  }

  public getTaskConfig(): Signal<LabConfig> {
    return this.taskConfig;
  }

  // save the current task and its form group to be able to save it from the dashboard
  // (outside the form component)
  public setCurrentTask(process: LabProcess, config: TdConfig): void {
    this.task = process;

    this.updateConfig(config);
  }

  public updateConfig(config: TdConfig): void {
    this.taskFormGp.set(LabConfigureSpecsFormComponent.buildFormGroup(config));
    this.taskConfig.set(LabConfig.fromSpecs(config.specs, config.values));
    this.task.config = config;
    this.nodeState.updateProcess(this.task);
  }

  public saveCurrentTaskConfig(): Observable<FlPortalActionResult | null> {
    if (this.task == null || this.taskFormGp() == null) return of(null);
    if (this.taskFormGp().valid) {
      return this.saveConfig(this.taskFormGp().getRawValue());
    } else {
      FlFormHelper.markAllAsTouched(this.taskFormGp());
      return of(null);
    }
  }

  private saveConfig(config: LabConfigureSpecsForm): Observable<FlPortalActionResult | null> {
    const configValue: PrConfigValues = { ...config.public, ...config.protected };

    // update the task config values
    return this.workflowEditConfig.updateProcessConfig(
      this.task.parentProtocolId,
      this.task.instanceName,
      configValue
    );
  }

  /**
   * return truc if the config has changed compared to the current task
   */
  public configHasChanged(process: LabProcess): boolean {
    return (
      !this.task ||
      this.task.id !== process.id ||
      !prConfigValueAreEqual(this.task.config.values, process.config.values)
    );
  }
}
