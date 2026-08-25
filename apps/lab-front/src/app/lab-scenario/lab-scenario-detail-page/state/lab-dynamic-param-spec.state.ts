import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LiProcess, LiProtocolService, LiProtocolUpdateDTO } from '@monorepo/lab-lib/li-core';
import {
  TD_PARAM_SPEC_INFO_LIST,
  TdAbstractDynamicParamSpecState,
  TdConfig,
  TdGenerateComputedParamResult,
  tdGetParamSpecInfo,
  TdParamSpec,
  TdParamSpecCategory,
  TdParamSpecInfo,
  TdParamSpecs,
  TdParamSpecTypeEnum,
  TdValidateComputedParamResult,
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

  override reorderEnabled = true;

  private process: LiProcess | null = null;

  setProcess(process: LiProcess): void {
    this.process = process;
    const dynamicConfigSpec = this.getDynamicConfigSpecParamSpecs();
    if (dynamicConfigSpec) {
      this.setParamSpecs(dynamicConfigSpec.additional_info.specs);
    }
  }

  private requireProcess(): LiProcess {
    if (this.process == null) {
      throw new Error('Process not set');
    }
    return this.process;
  }

  private requireDynamicConfigSpecName(): string {
    const specName = this.getDynamicConfigSpecName();
    if (specName == null) {
      throw new Error('No dynamic config spec found for this process');
    }
    return specName;
  }

  getParamSpecsInfos(): TdParamSpecInfo[] {
    // if the process is a virtual agent, we only allow simple types
    if (this.requireProcess().isVirtualEnvAgent()) {
      const paramSetSpecInfo = TD_PARAM_SPEC_INFO_LIST.find(
        (info) => info.type === TdParamSpecTypeEnum.PARAM_SET
      );
      return [
        ...tdGetParamSpecInfo([TdParamSpecCategory.SIMPLE, TdParamSpecCategory.CODE]),
        ...(paramSetSpecInfo ? [paramSetSpecInfo] : []),
      ];
    }
    // don't allow computed_param type
    return TD_PARAM_SPEC_INFO_LIST.filter((info) => info.type !== TdParamSpecTypeEnum.COMPUTED_PARAM);
  }

  getDynamicConfigSpecName(): string | null {
    const process = this.requireProcess();
    for (const spec of Object.keys(process.config.specs)) {
      if (process.config.specs[spec] && process.config.specs[spec].type == 'dynamic') {
        return spec;
      }
    }
    return null;
  }

  getDynamicConfigSpecParamSpecs(): TdParamSpec | null {
    const specName = this.getDynamicConfigSpecName();
    if (!specName) return null;
    return this.requireProcess().config.specs[specName];
  }

  openConfigureParamSpecsTableDialog(): void {
    this.openConfigureParamSpecsDialog(
      { text: 'biox.agent_params_spec_description', translateText: true },
      this.dialogService,
      this.viewContainerRef
    );
  }

  addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const process = this.requireProcess();
    const obs = this.labProtocolService.addDynamicParamSpec(
      process.parentProtocolId,
      process.instanceName,
      this.requireDynamicConfigSpecName(),
      paramName,
      paramSpec
    );
    return this.onPortalActionResult(obs);
  }

  deleteParamSpec(paramName: string): Observable<TdParamSpecs> {
    const process = this.requireProcess();
    const obs = this.labProtocolService.deleteDynamicParamSpec(
      process.parentProtocolId,
      process.instanceName,
      this.requireDynamicConfigSpecName(),
      paramName
    );
    return this.onPortalActionResult(obs);
  }

  editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const process = this.requireProcess();
    const obs = this.labProtocolService.updateDynamicParamSpec(
      process.parentProtocolId,
      process.instanceName,
      this.requireDynamicConfigSpecName(),
      paramName,
      paramSpec
    );
    return this.onPortalActionResult(obs);
  }

  renameAndEditParamSpec(oldName: string, newName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const process = this.requireProcess();
    const obs = this.labProtocolService.renameAndUpdateDynamicParamSpec(
      process.parentProtocolId,
      process.instanceName,
      this.requireDynamicConfigSpecName(),
      oldName,
      newName,
      paramSpec
    );
    return this.onPortalActionResult(obs);
  }

  reorderParamSpecs(paramNames: string[]): Observable<TdParamSpecs> {
    const process = this.requireProcess();
    const obs = this.labProtocolService.reorderDynamicParamSpecs(
      process.parentProtocolId,
      process.instanceName,
      this.requireDynamicConfigSpecName(),
      paramNames
    );
    return this.onPortalActionResult(obs);
  }

  private onPortalActionResult(obs: Observable<LiProtocolUpdateDTO>): Observable<TdParamSpecs> {
    return obs.pipe(
      map((result: LiProtocolUpdateDTO): TdParamSpecs => {
        if (result.process == null) {
          throw new Error('Missing process in the param spec update result');
        }
        const config = result.process.config as TdConfig;
        const specName = this.requireDynamicConfigSpecName();
        this.updateProcessConfig(specName, config);
        this.editConfig.updateProcessDynamicConfig(result);
        return config.specs[specName].additional_info.specs;
      })
    );
  }

  private updateProcessConfig(configSpecName: string, config: TdConfig): void {
    this.setParamSpecs(config.specs[configSpecName].additional_info.specs);
  }

  validateComputedExpression(): Observable<TdValidateComputedParamResult> | null {
    throw new Error('Computed param validation not implemented for lab dynamic params');
  }

  generateComputedExpression(): Observable<TdGenerateComputedParamResult> {
    throw new Error('generateComputedExpression not implemented');
  }
}
