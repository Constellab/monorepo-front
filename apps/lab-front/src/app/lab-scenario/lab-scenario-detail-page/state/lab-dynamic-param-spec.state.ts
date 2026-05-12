import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LiProcess, LiProtocolService, LiProtocolUpdateDTO } from '@monorepo/lab-lib/li-core';
import {
  TdAbstractDynamicParamSpecState,
  TdConfig,
  TdParamSpec,
  TdParamSpecs,
} from '@monorepo/technical-doc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LabWorkflowEditConfig } from '../model/lab-workflow-edit-config.class';

@Injectable()
export class LabDynamicParamSpecState extends TdAbstractDynamicParamSpecState implements OnDestroy {
  private labProtocolService = inject(LiProtocolService);
  private editConfig = inject(LabWorkflowEditConfig);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  private process: LiProcess = null;

  setProcess(process: LiProcess): void {
    this.process = process;
    const dynamicConfigSpec = this.getDynamicConfigSpecParamSpecs().additional_info.specs;
    this.setParamSpecs(dynamicConfigSpec);
  }

  getDynamicConfigSpecName(): string {
    for (const spec of Object.keys(this.process.config.specs)) {
      if (this.process.config.specs[spec] && this.process.config.specs[spec].type == 'dynamic') {
        return spec;
      }
    }

    throw new Error('No dynamic config spec found in process config');
  }

  getDynamicConfigSpecParamSpecs(): TdParamSpec {
    return this.process.config.specs[this.getDynamicConfigSpecName()];
  }

  openConfigureParamSpecsTableDialog(): void {
    this.openConfigureParamSpecsDialog(
      { text: 'biox.agent_params_spec_description', translateText: true },
      this.dialogService,
      this.viewContainerRef
    );
  }

  addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const obs = this.labProtocolService.addDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      this.getDynamicConfigSpecName(),
      paramName,
      paramSpec
    );
    return this.onPortalActionResult(obs);
  }

  deleteParamSpec(paramName: string): Observable<TdParamSpecs> {
    const obs = this.labProtocolService.deleteDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      this.getDynamicConfigSpecName(),
      paramName
    );
    return this.onPortalActionResult(obs);
  }

  editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const obs = this.labProtocolService.updateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      this.getDynamicConfigSpecName(),
      paramName,
      paramSpec
    );
    return this.onPortalActionResult(obs);
  }

  renameAndEditParamSpec(oldName: string, newName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const obs = this.labProtocolService.renameAndUpdateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      this.getDynamicConfigSpecName(),
      oldName,
      newName,
      paramSpec
    );
    return this.onPortalActionResult(obs);
  }

  private onPortalActionResult(obs: Observable<LiProtocolUpdateDTO>): Observable<TdParamSpecs> {
    return obs.pipe(
      map((result: LiProtocolUpdateDTO): TdParamSpecs => {
        const config = result.process.config as TdConfig;
        this.updateProcessConfig(this.getDynamicConfigSpecName(), config);
        this.editConfig.updateProcessDynamicConfig(result);
        return config.specs[this.getDynamicConfigSpecName()].additional_info.specs;
      })
    );
  }

  private updateProcessConfig(configSpecName: string, config: TdConfig): void {
    this.setParamSpecs(config.specs[configSpecName].additional_info.specs);
  }
}
