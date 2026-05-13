import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TdAbstractDynamicParamSpecState,
  TdParamSpec,
  TdParamSpecInfo,
  TdParamSpecs,
  TdValidateComputedParamResult,
} from '@monorepo/technical-doc';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CO_ADDITIONAL_INFO_DICT, CoTagKey } from '../model/co-tag-key.class';
import { CoConfig } from '../service/co-service-config.config';

@Injectable()
export class CoTagAdditionalInfoSpecState extends TdAbstractDynamicParamSpecState implements OnDestroy {
  private coConfigService = inject(CoConfig);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  onAdditionalInfoSpecsChanged$: Subject<TdParamSpecs> = new Subject<TdParamSpecs>();

  private tagKey: CoTagKey;

  init(tagKey: CoTagKey): void {
    this.tagKey = tagKey;
    this.setParamSpecs(tagKey.additionalInfosSpecs ?? {});
  }

  openConfigureParamSpecsTableDialog(): void {
    if (!this.tagKey) return;

    this.openConfigureParamSpecsDialog(
      { text: 'coCommunityLib.tag_additional_info_spec_description', translateText: true },
      this.dialogService,
      this.viewContainerRef
    );
  }

  addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.coConfigService
      .addAdditionalInfoSpec(this.tagKey.technicalName, paramName, paramSpec)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  deleteParamSpec(paramName: string): Observable<TdParamSpecs> {
    return this.coConfigService
      .deleteAdditionalInfoSpec(this.tagKey.technicalName, paramName)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.coConfigService
      .editAdditionalInfoSpec(this.tagKey.technicalName, paramName, paramSpec)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  getParamSpecsInfos(): TdParamSpecInfo[] {
    return CO_ADDITIONAL_INFO_DICT;
  }

  renameAndEditParamSpec(oldName: string, newName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.coConfigService
      .renameAndEditAdditionalInfoSpec(this.tagKey.technicalName, oldName, newName, paramSpec)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  ngOnDestroy(): void {
    this.onAdditionalInfoSpecsChanged$.complete();
    super.ngOnDestroy();
  }

  private onPortalActionResult(result: TdParamSpecs): TdParamSpecs {
    if (result && this.tagKey) {
      this.tagKey.additionalInfosSpecs = result;
      this.onAdditionalInfoSpecsChanged$.next(result);
    }
    return result;
  }

  validateComputedExpression(): Observable<TdValidateComputedParamResult> | null {
    throw new Error('Computed param validation not implemented for lab dynamic params');
  }
}
