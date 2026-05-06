import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import {
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
} from '../component/td-configure-param-specs-table-dialog/td-configure-param-specs-table-dialog.component';
import { TdParamSpecInfo } from '../component/td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';
import { TdParamSpec, TdParamSpecEntry, TdParamSpecs } from '../model/td-config-spec.class';

@Injectable()
export abstract class TdAbstractDynamicParamSpecState implements OnDestroy {
  public paramSpecsTable: FlArrayObs<TdParamSpecEntry> = new FlEntityArrayObs([], true);

  protected dialogService = inject(FlDialogService);
  protected viewContainerRef = inject(ViewContainerRef);

  setParamSpecs(paramSpecs: TdParamSpecs): void {
    const entries: TdParamSpecEntry[] = Object.entries(paramSpecs).map(([key, spec]) => ({ key, spec }));
    this.paramSpecsTable.setData(entries);
  }

  abstract openConfigureParamSpecsTableDialog(): void;

  protected openConfigureParamSpecsDialog(dynamicParamsDescription: FlTranslatableText): void {
    const input: TdConfigureParamSpecsTableDialogInput = {
      dynamicParamsDescription: dynamicParamsDescription,
    };

    this.dialogService.openMediumDialog(TdConfigureParamSpecsTableDialogComponent, {
      data: input,
      viewContainerRef: this.viewContainerRef,
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

  abstract getParamSpecsInfos(): Observable<TdParamSpecInfo[]>;

  ngOnDestroy(): void {
    this.paramSpecsTable?.disconnect();
  }
}
