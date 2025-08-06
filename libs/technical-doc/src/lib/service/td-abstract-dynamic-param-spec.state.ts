import { Injectable, OnDestroy } from '@angular/core';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { TdCompleteEditParamSpecDict } from '../component/td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';
import { TdEditableParamSpec } from '../component/td-editable-param-specs-table/td-editable-param-specs-table.component';
import { TdConfigI } from '../model/td-config.class';
import { TdParamSpec, TdParamSpecs } from '../model/td-config-spec.class';

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
  ): Observable<TdConfigI | TdParamSpecs>;

  abstract editParamSpec(
    configSpecName: string,
    paramName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfigI | TdParamSpecs>;

  abstract renameAndEditParamSpec(
    configSpecName: string,
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfigI | TdParamSpecs>;

  abstract deleteParamSpec(configSpecName: string, paramName: string): Observable<TdConfigI | TdParamSpecs>;

  abstract getParamSpecsInfos(): Observable<TdCompleteEditParamSpecDict>;

  ngOnDestroy(): void {
    this.paramSpecsTable?.disconnect();
  }
}
