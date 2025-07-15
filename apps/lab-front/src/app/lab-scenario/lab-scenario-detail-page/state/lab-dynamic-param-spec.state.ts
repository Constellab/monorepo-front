import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';
import { LiProcess, LiProtocolService, LiProtocolUpdateDTO } from '@monorepo/lab-lib/li-core';
import {
  TdAbstractDynamicParamSpecState,
  TdCompleteEditParamSpecDict,
  TdConfig,
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
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

  constructor() {
    super();
  }

  setProcess(process: LiProcess): void {
    this.process = process;
    for (const spec of Object.keys(process.config.specs)) {
      if (process.config.specs[spec] && process.config.specs[spec].type == 'dynamic') {
        this.setParamSpecs(process.config.specs[spec].additional_info.specs);
      }
    }
  }

  openEditConfigDialog(configName: string): void {
    if (this.process.config.specs[configName]?.type != 'dynamic') return;

    const paramsSpecs: TdParamSpecs = (this.process.config.specs[configName].additional_info.specs =
      this.process.config.values);

    const input: TdConfigureParamSpecsTableDialogInput = {
      paramSpecs: paramsSpecs,
      configSpecName: configName,
      dynamicParamsDescription: {
        text: 'biox.agent_params_spec_description',
        translateText: true,
      },
    };

    this.dialogService
      .openMediumDialog(TdConfigureParamSpecsTableDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe(() => {});
  }

  addParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdConfig> {
    const obs = this.labProtocolService.addDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.onPortalActionResult(obs, configSpecName);
  }

  deleteParamSpec(configSpecName: string, paramName: string): Observable<TdConfig> {
    const obs = this.labProtocolService.deleteDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName
    );
    return this.onPortalActionResult(obs, configSpecName);
  }

  editParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdConfig> {
    const obs = this.labProtocolService.updateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.onPortalActionResult(obs, configSpecName);
  }

  renameAndEditParamSpec(
    configSpecName: string,
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfig> {
    const obs = this.labProtocolService.renameAndUpdateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      oldName,
      newName,
      paramSpec
    );
    return this.onPortalActionResult(obs, configSpecName);
  }

  getParamSpecsInfos(): Observable<TdCompleteEditParamSpecDict> {
    return this.labProtocolService.getParamSpecsInfos(
      this.process.parentProtocolId,
      this.process.instanceName
    );
  }

  private onPortalActionResult(
    obs: Observable<LiProtocolUpdateDTO>,
    configSpecName: string
  ): Observable<TdConfig> {
    return obs.pipe(
      map((result: LiProtocolUpdateDTO): TdConfig => {
        const config = result.process.config as TdConfig;
        this.updateProcessConfig(configSpecName, config);
        this.editConfig.updateProcessDynamicConfig(result);
        return config;
      })
    );
  }

  private updateProcessConfig(configSpecName: string, config: TdConfig): void {
    this.setParamSpecs(config.specs[configSpecName].additional_info.specs);
  }
}
