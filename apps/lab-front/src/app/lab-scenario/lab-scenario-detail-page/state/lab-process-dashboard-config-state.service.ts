import { inject, Injectable, Signal, signal,WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';
import { LiProcess } from '@monorepo/lab-lib/li-core';
import { PR_CONFIG_VALUE_ARE_EQUAL } from '@monorepo/protocol';
import {
  TdConfig,
  TdConfigI,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecsValues,
} from '@monorepo/technical-doc';
import { Observable, of } from 'rxjs';

import { LabWorkflowEditConfig } from '../model/lab-workflow-edit-config.class';

/**
 * State for the process dashboard configuration.
 */
@Injectable()
export class LabProcessDashboardConfigState {
  private workflowEditConfig = inject(LabWorkflowEditConfig);

  private parentProtocolId: string;
  private taskInstanceName: string;
  private config: TdConfigI;

  private taskFormGp: WritableSignal<FormGroup<TdConfigureSpecsForm>> = signal(null);
  private taskConfig: WritableSignal<TdConfig> = signal(null);

  public getTaskFormGp(): Signal<FormGroup<TdConfigureSpecsForm>> {
    return this.taskFormGp;
  }

  public getTaskConfig(): Signal<TdConfig> {
    return this.taskConfig;
  }

  // save the current task and its form group to be able to save it from the dashboard
  // (outside the form component)
  public setCurrentTask(parentProtocolId: string, taskInstanceName: string, config: TdConfigI): void {
    this.parentProtocolId = parentProtocolId;
    this.taskInstanceName = taskInstanceName;
    this.config = config;
    this.taskFormGp.set(TdConfigureSpecsFormComponent.buildFormGroup(config));
    this.taskConfig.set(TdConfig.fromSpecs(config.specs, config.values));
  }

  public saveCurrentTaskConfig(): Observable<FlPortalActionResult | null> {
    if (this.taskInstanceName == null || this.taskFormGp() == null) return of(null);
    if (this.taskFormGp().valid) {
      const configValue: TdParamSpecsValues = TdConfigureSpecsFormComponent.buildValues(this.taskFormGp());
      return this.saveConfig(configValue);
    } else {
      FlFormHelper.markAllAsTouched(this.taskFormGp());
      return of(null);
    }
  }

  private saveConfig(configValue: TdParamSpecsValues): Observable<FlPortalActionResult | null> {
    this.config.values = configValue;
    // update the task config values
    return this.workflowEditConfig.saveProcessConfig(
      this.parentProtocolId,
      this.taskInstanceName,
      configValue
    );
  }

  /**
   * return truc if the config has changed compared to the current task
   */
  public configHasChanged(process: LiProcess): boolean {
    return (
      !this.taskInstanceName ||
      !this.parentProtocolId ||
      this.taskInstanceName !== process.instanceName ||
      this.parentProtocolId !== process.parentProtocolId ||
      !PR_CONFIG_VALUE_ARE_EQUAL(this.config.specs, process.config.specs) ||
      !PR_CONFIG_VALUE_ARE_EQUAL(this.config.values, process.config.values)
    );
  }

  public clearTask(): void {
    this.taskFormGp.set(null);
    this.taskConfig.set(null);
    this.config = null;
    this.parentProtocolId = null;
    this.taskInstanceName = null;
  }
}
