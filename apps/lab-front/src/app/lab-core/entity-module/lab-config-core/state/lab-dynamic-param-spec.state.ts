import {
  TdAbstractDynamicParamSpecState,
  TdParamSpec,
  TdParamSpecFormInfoList,
} from '@monorepo/technical-doc';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { LabProtocolService } from '../../../entity-service/lab-protocol.service';
import { LabProcess } from '../../../model/entities/process/lab-process.entity';
import { LabConfig } from '../../../model/entities/lab-config.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabWorkflowEditConfig } from '../../../../lab-scenario/lab-scenario-detail-page/model/lab-workflow-edit-config.class';
import { FlPortalActionResult } from '@monorepo/front-core-lib';

@Injectable()
export class LabDynamicParamSpecState extends TdAbstractDynamicParamSpecState {
  protocolId: WritableSignal<string> = signal<string>(null);
  process: WritableSignal<LabProcess> = signal<LabProcess>(null);

  constructor(
    private labProtocolService: LabProtocolService,
    private editConfig: LabWorkflowEditConfig
  ) {
    super();
  }

  init(process: LabProcess): void {
    this.onProcess(process);
  }

  addParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    const obs = this.labProtocolService.addDynamicParamSpec(
      this.protocolId(),
      this.process().instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.editConfig.addParamSpecUpdateAction(this.process(), obs).pipe(
      map((result: FlPortalActionResult | null) => {
        if (result && result.status == 'success') {
          const config = result.result as LabConfig;
          this.updateProcessConfig(configSpecName, config);
          return config;
        }
        return null;
      })
    );
  }

  deleteParamSpec(configSpecName: string, paramName: string): Observable<LabConfig> {
    const obs = this.labProtocolService.deleteDynamicParamSpec(
      this.protocolId(),
      this.process().instanceName,
      configSpecName,
      paramName
    );
    return this.editConfig.deleteParamSpecUpdateAction(this.process(), obs).pipe(
      map((result: FlPortalActionResult | null) => {
        if (result && result.status == 'success') {
          const config = result.result as LabConfig;
          this.updateProcessConfig(configSpecName, config);
          return config;
        }
        return null;
      })
    );
  }

  editParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    const obs = this.labProtocolService.updateDynamicParamSpec(
      this.protocolId(),
      this.process().instanceName,
      configSpecName,
      paramName,
      paramSpec
    );
    return this.editConfig.updateParamSpecUpdateAction(this.process(), obs).pipe(
      map((result: FlPortalActionResult | null) => {
        if (result && result.status == 'success') {
          const config = result.result as LabConfig;
          this.updateProcessConfig(configSpecName, config);
          return config;
        }
        return null;
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
      this.protocolId(),
      this.process().instanceName,
      configSpecName,
      oldName,
      newName,
      paramSpec
    );
    return this.editConfig.updateParamSpecUpdateAction(this.process(), obs).pipe(
      map((result: FlPortalActionResult): LabConfig => {
        if (result && result.status == 'success') {
          const config = result.result as LabConfig;
          this.updateProcessConfig(configSpecName, config);
          return config;
        }
        return null;
      })
    );
  }

  getParamSpecsInfos(): Observable<TdParamSpecFormInfoList> {
    return this.labProtocolService.getParamSpecsInfos(this.protocolId(), this.process().instanceName);
  }

  private updateProcessConfig(configSpecName: string, config: LabConfig): void {
    this.setParamSpecs(config.specs[configSpecName].additional_info.specs);
  }

  private onProcess(process: LabProcess): void {
    this.protocolId.set(process.parentProtocolId);
    this.process.set(process);
    for (const spec of Object.keys(process.config.specs)) {
      if (process.config.specs[spec] && process.config.specs[spec].type == 'dynamic') {
        this.setParamSpecs(process.config.specs[spec].additional_info.specs);
      }
    }
  }
}
