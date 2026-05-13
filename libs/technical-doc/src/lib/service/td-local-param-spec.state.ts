import { Observable, of } from 'rxjs';

import {
  TD_PARAM_SPEC_INFO_LIST,
  TdParamSpec,
  TdParamSpecInfo,
  TdParamSpecs,
  TdParamSpecTypeEnum,
  TdValidateComputedParamResult,
} from '../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from './td-abstract-dynamic-param-spec.state';

/**
 * Local (in-memory) implementation of TdAbstractDynamicParamSpecState.
 * Used for managing sub-params of a param_set without backend calls.
 */
export class TdLocalParamSpecState extends TdAbstractDynamicParamSpecState {
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

  getCurrentSpecs(): TdParamSpecs {
    const record: TdParamSpecs = {};
    for (const entry of this.paramSpecsTable.array) {
      record[entry.key] = entry.spec;
    }
    return record;
  }

  /**
   * We can have param_set inside another param_set,
   * so we remove the param_set type from the list.
   * @returns
   */
  getParamSpecsInfos(): TdParamSpecInfo[] {
    return TD_PARAM_SPEC_INFO_LIST.filter((info) => info.type !== TdParamSpecTypeEnum.PARAM_SET);
  }

  validateComputedExpression(): Observable<TdValidateComputedParamResult> | null {
    throw new Error('Computed param validation not implemented for lab dynamic params');
  }
}
