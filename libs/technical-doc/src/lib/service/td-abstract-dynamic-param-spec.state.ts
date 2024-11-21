import { TdConfig, TdParamSpec, TdParamSpecFormInfoList, TdParamSpecs } from '../model/td-config-spec.class';
import { Observable } from 'rxjs';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib';
import { TdEditableParamSpec } from '../component/td-editable-param-specs-table/td-editable-param-specs-table.component';

export abstract class TdAbstractDynamicParamSpecState {
  private paramSpecs: TdParamSpecs;

  public paramSpecsTable: FlArrayObs<TdEditableParamSpec> = new FlEntityArrayObs([], true);

  setParamSpecs(paramSpecs: TdParamSpecs): void {
    this.paramSpecs = paramSpecs;
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

  abstract addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdConfig>;

  abstract editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdConfig>;

  abstract renameAndEditParamSpec(
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdConfig>;

  abstract deleteParamSpec(paramName: string): Observable<TdConfig>;

  abstract getParamSpecsInfos(): Observable<TdParamSpecFormInfoList>;

  onDestroy(): void {
    this.paramSpecsTable?.disconnect();
  }
}
