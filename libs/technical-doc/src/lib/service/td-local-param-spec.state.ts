import { Observable, of } from 'rxjs';

import { TdParamSpecInfo } from '../component/td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';
import { TdParamSpec, TdParamSpecs } from '../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from './td-abstract-dynamic-param-spec.state';

/**
 * Local (in-memory) implementation of TdAbstractDynamicParamSpecState.
 * Used for managing sub-params of a param_set without backend calls.
 */
export class TdLocalParamSpecState extends TdAbstractDynamicParamSpecState {
  private paramSpecInfoList$: Observable<TdParamSpecInfo[]>;

  constructor(paramSpecInfoList$: Observable<TdParamSpecInfo[]>) {
    super();
    this.paramSpecInfoList$ = paramSpecInfoList$;
  }

  openConfigureParamSpecsTableDialog(): void {
    // noop — not used in local mode
  }

  addParamSpec(key: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    const specs = this.getCurrentSpecs();
    specs[key] = spec;
    this.setParamSpecs(specs);
    return of(specs);
  }

  editParamSpec(key: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    const specs = this.getCurrentSpecs();
    specs[key] = spec;
    this.setParamSpecs(specs);
    return of(specs);
  }

  renameAndEditParamSpec(oldKey: string, newKey: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    const specs = this.getCurrentSpecs();
    delete specs[oldKey];
    specs[newKey] = spec;
    this.setParamSpecs(specs);
    return of(specs);
  }

  deleteParamSpec(key: string): Observable<TdParamSpecs> {
    const specs = this.getCurrentSpecs();
    delete specs[key];
    this.setParamSpecs(specs);
    return of(specs);
  }

  getParamSpecsInfos(): Observable<TdParamSpecInfo[]> {
    return this.paramSpecInfoList$;
  }

  getCurrentSpecs(): TdParamSpecs {
    const record: TdParamSpecs = {};
    for (const entry of this.paramSpecsTable.array) {
      record[entry.key] = entry.spec;
    }
    return record;
  }
}
