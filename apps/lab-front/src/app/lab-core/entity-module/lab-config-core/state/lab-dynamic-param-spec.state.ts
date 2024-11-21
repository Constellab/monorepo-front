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

@Injectable()
export class LabDynamicParamSpecState extends TdAbstractDynamicParamSpecState {
  protocolId: WritableSignal<string> = signal<string>(null);
  process: WritableSignal<LabProcess> = signal<LabProcess>(null);

  constructor(private labProtocolService: LabProtocolService) {
    super();
  }

  init(process: LabProcess): void {
    this.onProcess(process);
  }

  addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    return this.labProtocolService
      .addDynamicParamSpec(this.protocolId(), this.process().instanceName, paramName, paramSpec)
      .pipe(
        map((config: LabConfig) => {
          this.updateProcessConfig(config);
          return config;
        })
      );
  }

  deleteParamSpec(paramName: string): Observable<LabConfig> {
    return this.labProtocolService.deleteDynamicParamSpec(
      this.protocolId(),
      this.process().instanceName,
      paramName
    );
  }

  editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    return this.labProtocolService
      .updateDynamicParamSpec(this.protocolId(), this.process().instanceName, paramName, paramSpec)
      .pipe(
        map((config: LabConfig) => {
          this.updateProcessConfig(config);
          return config;
        })
      );
  }

  renameAndEditParamSpec(oldName: string, newName: string, paramSpec: TdParamSpec): Observable<LabConfig> {
    return this.labProtocolService
      .renameAndUpdateDynamicParamSpec(
        this.protocolId(),
        this.process().instanceName,
        oldName,
        newName,
        paramSpec
      )
      .pipe(
        map((config: LabConfig) => {
          this.updateProcessConfig(config);
          return config;
        })
      );
  }

  getParamSpecsInfos(): Observable<TdParamSpecFormInfoList> {
    return this.labProtocolService.getParamSpecsInfos();
  }

  private updateProcessConfig(config: LabConfig): void {
    this.setParamSpecs(config.specs['params'].additional_info.specs);
  }

  private onProcess(process: LabProcess): void {
    this.protocolId.set(process.parentProtocolId);
    this.process.set(process);
    if (process.config.specs['params'] && process.config.specs['params'].type == 'dynamic') {
      this.setParamSpecs(process.config.specs['params'].additional_info.specs);
    }
  }
}
