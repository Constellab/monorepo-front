import {
  TdAbstractDynamicParamSpecState,
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
  TdParamSpec,
  TdParamSpecFormInfoList,
  TdParamSpecs,
} from '@monorepo/technical-doc';
import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { LabProtocolService } from '../../../entity-service/lab-protocol.service';
import { LabProcess } from '../../../model/entities/process/lab-process.entity';
import { LabConfig } from '../../../model/entities/lab-config.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabWorkflowEditConfig } from '../../../../lab-scenario/lab-scenario-detail-page/model/lab-workflow-edit-config.class';
import { FlDialogService, FlPortalActionResult } from '@monorepo/front-core-lib';
import { LabProtocolUpdateDTO } from '../../../../lab-scenario/lab-scenario-detail-page/model/lab-workflow-action.class';

@Injectable()
export class LabDynamicParamSpecState extends TdAbstractDynamicParamSpecState implements OnDestroy {
  private labProtocolService = inject(LabProtocolService);
  private editConfig = inject(LabWorkflowEditConfig);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  private process: LabProcess = null;

  setProcess(process: LabProcess): void {
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
    };

    this.dialogService.openMediumDialog(TdConfigureParamSpecsTableDialogComponent, {
      data: input,
      viewContainerRef: this.viewContainerRef,
    });
  }

  addParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    const obs = this.labProtocolService.addDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.editConfig.addParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LabProtocolUpdateDTO> | null) => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
  }

  deleteParamSpec(configSpecName: string, paramName: string): Observable<LabConfig> {
    const obs = this.labProtocolService.deleteDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName
    );
    return this.editConfig.deleteParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LabProtocolUpdateDTO> | null) => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
  }

  editParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    const obs = this.labProtocolService.updateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.editConfig.updateParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LabProtocolUpdateDTO> | null) => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
  }

  renameAndEditParamSpec(
    configSpecName: string,
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<LabConfig> {
    const obs = this.labProtocolService.renameAndUpdateDynamicParamSpec(
      this.process.parentProtocolId,
      this.process.instanceName,
      configSpecName,
      oldName,
      newName,
      paramSpec
    );
    return this.editConfig.updateParamSpecUpdateAction(this.process, obs).pipe(
      map((result: FlPortalActionResult<LabProtocolUpdateDTO>): LabConfig => {
        return this.onPortalActionResult(result, configSpecName);
      })
    );
  }

  getParamSpecsInfos(): Observable<TdParamSpecFormInfoList> {
    return this.labProtocolService.getParamSpecsInfos(
      this.process.parentProtocolId,
      this.process.instanceName
    );
  }

  private onPortalActionResult(
    result: FlPortalActionResult<LabProtocolUpdateDTO>,
    configSpecName: string
  ): LabConfig {
    if (result && result.status == 'success') {
      const config = result.result.process.config as LabConfig;
      this.updateProcessConfig(configSpecName, config);
      return config;
    }
    return null;
  }

  private updateProcessConfig(configSpecName: string, config: LabConfig): void {
    this.setParamSpecs(config.specs[configSpecName].additional_info.specs);
  }
}
