import { TdConfig, TdParamSpec, TdParamSpecFormInfoList, TdParamSpecs } from '../model/td-config-spec.class';
import { Observable } from 'rxjs';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { TdEditableParamSpec } from '../component/td-editable-param-specs-table/td-editable-param-specs-table.component';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export abstract class TdAbstractDynamicParamSpecState implements OnDestroy {
  public paramSpecsTable: FlArrayObs<TdEditableParamSpec> = new FlEntityArrayObs([], true);

  setParamSpecs(paramSpecs: TdParamSpecs): void {
    this.paramSpecsTable.clear();
    const editableParamSpecs: TdEditableParamSpec[] = [];
    for (const param of Object.keys(paramSpecs)) {
      editableParamSpecs.push({
        name: param,
        ...paramSpecs[param],
      } as TdEditableParamSpec);
    }

    this.paramSpecsTable.addItem(editableParamSpecs);
  }

  abstract openEditConfigDialog(configName: string): void;

  abstract addParamSpec(
    configSpecName: string,
    paramName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfig>;

  abstract editParamSpec(
    configSpecName: string,
    paramName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfig>;

  abstract renameAndEditParamSpec(
    configSpecName: string,
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfig>;

  abstract deleteParamSpec(configSpecName: string, paramName: string): Observable<TdConfig>;

  abstract getParamSpecsInfos(): Observable<TdParamSpecFormInfoList>;

  ngOnDestroy(): void {
    this.paramSpecsTable?.disconnect();
  }
}
