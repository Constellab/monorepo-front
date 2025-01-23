import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { LabWorkflowEditConfig } from '../model/lab-workflow-edit-config.class';
import { FormGroup } from '@angular/forms';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';
import { LabConfig } from '../../../lab-core/model/entities/lab-config.entity';
import { Observable, of } from 'rxjs';
import { prConfigValueAreEqual, PrConfigValues } from '@monorepo/protocol';
import { LabProcess } from '../../../lab-core/model/entities/process/lab-process.entity';
import { TdConfig } from '@monorepo/technical-doc';
import {
  LabConfigureSpecsForm,
  LabConfigureSpecsFormComponent,
} from '../../../lab-core/entity-module/lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';

/**
 * State for the process dashboard configuration.
 */
@Injectable()
export class LabProcessDashboardConfigState {
  private workflowEditConfig = inject(LabWorkflowEditConfig);

  private parentProtocolId: string;
  private taskInstanceName: string;
  private config: TdConfig;

  private taskFormGp: WritableSignal<FormGroup<LabConfigureSpecsForm>> = signal(null);
  private taskConfig: WritableSignal<LabConfig> = signal(null);

  public getTaskFormGp(): Signal<FormGroup<LabConfigureSpecsForm>> {
    return this.taskFormGp;
  }

  public getTaskConfig(): Signal<LabConfig> {
    return this.taskConfig;
  }

  // save the current task and its form group to be able to save it from the dashboard
  // (outside the form component)
  public setCurrentTask(parentProtocolId: string, taskInstanceName: string, config: TdConfig): void {
    this.parentProtocolId = parentProtocolId;
    this.taskInstanceName = taskInstanceName;
    this.config = config;
    this.taskFormGp.set(LabConfigureSpecsFormComponent.buildFormGroup(config));
    this.taskConfig.set(LabConfig.fromSpecs(config.specs, config.values));
  }

  public saveCurrentTaskConfig(): Observable<FlPortalActionResult | null> {
    if (this.taskInstanceName == null || this.taskFormGp() == null) return of(null);
    if (this.taskFormGp().valid) {
      const configValue: PrConfigValues = LabConfigureSpecsFormComponent.buildValues(this.taskFormGp());
      return this.saveConfig(configValue);
    } else {
      FlFormHelper.markAllAsTouched(this.taskFormGp());
      return of(null);
    }
  }

  private saveConfig(configValue: PrConfigValues): Observable<FlPortalActionResult | null> {
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
  public configHasChanged(process: LabProcess): boolean {
    return (
      !this.taskInstanceName ||
      !this.parentProtocolId ||
      this.taskInstanceName !== process.instanceName ||
      this.parentProtocolId !== process.parentProtocolId ||
      !prConfigValueAreEqual(this.config.specs, process.config.specs) ||
      !prConfigValueAreEqual(this.config.values, process.config.values)
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
