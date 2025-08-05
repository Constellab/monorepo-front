import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TdAbstractDynamicParamSpecState,
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
  TdEditParamSpecDict,
  TdParamSpec,
  TdParamSpecs,
} from '@monorepo/technical-doc';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { coAdditionalInfoInfosDict, CoTagKey } from '../model/co-tag-key.class';
import { CoConfig } from '../service/co-service-config.config';

@Injectable()
export class CoTagAdditionalInfoSpecState extends TdAbstractDynamicParamSpecState implements OnDestroy {
  private coConfigService = inject(CoConfig);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  onAdditionalInfoSpecsChanged$: Subject<TdParamSpecs> = new Subject<TdParamSpecs>();

  private tagKey: CoTagKey;

  constructor() {
    super();
  }

  init(tagKey: CoTagKey): void {
    this.tagKey = tagKey;
    this.setParamSpecs(tagKey.additionalInfosSpecs ?? {});
  }

  openEditConfigDialog(): void {
    if (!this.tagKey) return;

    const paramSpecs: TdParamSpecs = this.tagKey.additionalInfosSpecs;

    const input: TdConfigureParamSpecsTableDialogInput = {
      paramSpecs: paramSpecs,
      configSpecName: this.tagKey.technicalName,
      dynamicParamsDescription: {
        text: 'coCommunityLib.tag_additional_info_spec_description',
        translateText: true,
      },
    };

    this.dialogService.openMediumDialog(TdConfigureParamSpecsTableDialogComponent, {
      data: input,
      viewContainerRef: this.viewContainerRef,
    });
  }

  addParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.coConfigService
      .addAdditionalInfoSpec(configSpecName, paramName, paramSpec)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  deleteParamSpec(configSpecName: string, paramName: string): Observable<TdParamSpecs> {
    return this.coConfigService
      .deleteAdditionalInfoSpec(configSpecName, paramName)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  editParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.coConfigService
      .editAdditionalInfoSpec(configSpecName, paramName, paramSpec)
      .pipe(map((result: TdParamSpecs) => this.onPortalActionResult(result)));
  }

  getParamSpecsInfos(): Observable<TdEditParamSpecDict> {
    return of(coAdditionalInfoInfosDict);
  }

  renameAndEditParamSpec(
    configSpecName: string,
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return this.coConfigService
      .renameAndEditAdditionalInfoSpec(configSpecName, oldName, newName, paramSpec)
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
}
