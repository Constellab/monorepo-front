import {Injectable} from '@angular/core';
import {LabWorkflowEditConfig} from '../model/lab-workflow-edit-config.class';
import {UntypedFormGroup} from '@angular/forms';
import {FlFormHelper, FlPortalActionResult} from '@monorepo/front-core-lib';
import {LabConfigureSpecsForm} from '../../../../lab-core/model/entities/lab-config.entity';
import {LabProcess} from '../../../../lab-core/model/entities/process/lab-process.entity';
import {Observable, of} from 'rxjs';

/**
 * State for the node dashboard
 */
@Injectable()
export class LabWorkflowNodeDashboardState {

  private task: LabProcess;
  private taskFormGp: UntypedFormGroup;

  constructor(private workflowEditConfig: LabWorkflowEditConfig) {
  }

  // save the current task and its form group to be able to save it from the dashboard
  // (outside the form component)
  public setCurrentTask(process: LabProcess, processFormGp: UntypedFormGroup): void {
    this.task = process;
    this.taskFormGp = processFormGp;
  }

  public saveCurrentTaskConfig(): Observable<FlPortalActionResult | null> {
    if (this.task == null || this.taskFormGp == null) return of(null);
    if (this.taskFormGp.valid) {
      return this.saveConfig(this.taskFormGp.getRawValue());
    } else {
      FlFormHelper.markAllAsTouched(this.taskFormGp);
      return of(null);
    }
  }

  private saveConfig(config: LabConfigureSpecsForm): Observable<FlPortalActionResult | null> {
    const configValue = {...config.public, ...config.protected};
    return this.workflowEditConfig.updateProcessConfig(this.task.parentProtocolId, this.task.instanceName, configValue);
  }

}
