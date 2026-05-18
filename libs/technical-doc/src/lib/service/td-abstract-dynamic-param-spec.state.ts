import { Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import type { TdConfigureParamSpecsTableDialogInput } from '../component/td-configure-param-specs-table-dialog/td-configure-param-specs-table-dialog.component';
import {
  TD_PARAM_SPEC_INFO_LIST,
  TdParamSpec,
  TdParamSpecEntry,
  TdParamSpecInfo,
  TdParamSpecs,
  TdValidateComputedParamResult,
} from '../model/td-config-spec.class';

@Injectable()
export abstract class TdAbstractDynamicParamSpecState implements OnDestroy {
  public paramSpecsTable: FlArrayObs<TdParamSpecEntry> = new FlEntityArrayObs([], true);
  public reorderEnabled = false;

  getParamSpecs(): TdParamSpecs {
    return this.paramSpecsTable.array.reduce((specs, entry) => ({ ...specs, [entry.key]: entry.spec }), {});
  }

  setParamSpecs(paramSpecs: TdParamSpecs): void {
    const entries: TdParamSpecEntry[] = Object.entries(paramSpecs).map(([key, spec]) => ({ key, spec }));
    this.paramSpecsTable.setData(entries);
  }

  abstract openConfigureParamSpecsTableDialog(): void;

  protected async openConfigureParamSpecsDialog(
    dynamicParamsDescription: FlTranslatableText,
    dialogService: FlDialogService,
    viewContainerRef: ViewContainerRef
  ): Promise<void> {
    const { TdConfigureParamSpecsTableDialogComponent } =
      // eslint-disable-next-line max-len
      await import('../component/td-configure-param-specs-table-dialog/td-configure-param-specs-table-dialog.component');

    const input: TdConfigureParamSpecsTableDialogInput = {
      dynamicParamsDescription: dynamicParamsDescription,
    };

    dialogService.openMediumDialog(TdConfigureParamSpecsTableDialogComponent, {
      data: input,
      viewContainerRef: viewContainerRef,
    });
  }

  abstract addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs>;

  abstract editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs>;

  abstract renameAndEditParamSpec(
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdParamSpecs>;

  abstract deleteParamSpec(paramName: string): Observable<TdParamSpecs>;

  abstract reorderParamSpecs(_paramNames?: string[]): Observable<TdParamSpecs> | null;

  abstract validateComputedExpression(
    expression: string,
    key?: string,
    paramSetKey?: string
  ): Observable<TdValidateComputedParamResult> | null;

  getParamSpecsInfos(): TdParamSpecInfo[] {
    return TD_PARAM_SPEC_INFO_LIST;
  }

  ngOnDestroy(): void {
    this.paramSpecsTable?.disconnect();
  }
}
