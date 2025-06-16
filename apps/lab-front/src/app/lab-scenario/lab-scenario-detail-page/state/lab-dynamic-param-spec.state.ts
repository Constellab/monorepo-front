import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';
import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { LiProcess, LiProtocolService, LiProtocolUpdateDTO } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';
import {
  TdAbstractDynamicParamSpecState,
  TdConfig,
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
  TdEditParamSpecDict,
  TdParamSpec,
  TdParamSpecs,
} from '@monorepo/technical-doc';
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
        text: 'li.agent_params_spec_description',
        translateText: true,
      },
    };

    this.dialogService.openMediumDialog(TdConfigureParamSpecsTableDialogComponent, {
      data: input,
      viewContainerRef: this.viewContainerRef,
    });
  }

  addParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdConfig> {
    const obs = this.labProtocolService.addDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.editConfig.addParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LiProtocolUpdateDTO> | null) => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
  }

  deleteParamSpec(configSpecName: string, paramName: string): Observable<TdConfig> {
    const obs = this.labProtocolService.deleteDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName
    );
    return this.editConfig.deleteParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LiProtocolUpdateDTO> | null) => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
  }

  editParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdConfig> {
    const obs = this.labProtocolService.updateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.editConfig.updateParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LiProtocolUpdateDTO> | null) => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
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
    return this.editConfig
      .updateParamSpecUpdateAction(this.process, obs)
      .pipe(
        map(
          (result: FlPortalActionResult<LiProtocolUpdateDTO>): TdConfig =>
            this.onPortalActionResult(result, configSpecName)
        )
      );
  }

  getParamSpecsInfos(): Observable<TdEditParamSpecDict> {
    return this.labProtocolService.getParamSpecsInfos(
      this.process.parentProtocolId,
      this.process.instanceName
    );
  }

  private onPortalActionResult(
    result: FlPortalActionResult<LiProtocolUpdateDTO>,
    configSpecName: string
  ): TdConfig {
    if (result && result.status == 'success') {
      const config = result.result.process.config as TdConfig;
      this.updateProcessConfig(configSpecName, config);
      return config;
    }
    return null;
  }

  private updateProcessConfig(configSpecName: string, config: TdConfig): void {
    this.setParamSpecs(config.specs[configSpecName].additional_info.specs);
  }
}
