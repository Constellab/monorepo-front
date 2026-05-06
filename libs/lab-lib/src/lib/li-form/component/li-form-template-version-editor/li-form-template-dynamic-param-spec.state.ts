import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TdAbstractDynamicParamSpecState,
  TdCompleteEditParamSpecDict,
  TdEditableParamSpec,
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
  TdParamSpec,
  TdParamSpecs,
} from '@monorepo/technical-doc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LiFormTemplateVersion } from '../../model/li-form-template-version.entity';
import { LiFormTemplateService } from '../../service/li-form-template.service';

@Injectable()
export class LiFormTemplateDynamicParamSpecState
  extends TdAbstractDynamicParamSpecState
  implements OnDestroy
{
  private formTemplateService = inject(LiFormTemplateService);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  private templateId: string;
  private versionId: string;
  private content: TdParamSpecs = {};

  private static readonly CONFIG_SPEC_NAME = 'fields';

  setVersionContent(templateId: string, versionId: string, content: TdParamSpecs): void {
    this.templateId = templateId;
    this.versionId = versionId;
    this.content = content ?? {};
    this.setParamSpecs(this.content);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openEditConfigDialog(_configName: string): void {
    this.openParamSpecDialog();
  }

  openParamSpecDialog(param?: TdEditableParamSpec): void {
    const input: TdEditParamSpecDialogInput = {
      paramSpecFormInfoList$: this.getParamSpecsInfos(),
      configSpecName: LiFormTemplateDynamicParamSpecState.CONFIG_SPEC_NAME,
      name: param?.name,
      spec: param ? (Object.assign({}, param) as TdParamSpec) : null,
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe((result: TdParamSpecs) => {
        if (result) {
          this.content = result;
          this.setParamSpecs(this.content);
        }
      });
  }

  addParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const updatedContent = { ...this.content, [paramName]: paramSpec };
    return this.updateAndRefresh(updatedContent);
  }

  editParamSpec(configSpecName: string, paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    const updatedContent = { ...this.content, [paramName]: paramSpec };
    return this.updateAndRefresh(updatedContent);
  }

  renameAndEditParamSpec(
    configSpecName: string,
    oldName: string,
    newName: string,
    paramSpec: TdParamSpec
  ): Observable<TdParamSpecs> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [oldName]: _old, ...rest } = this.content;
    const updatedContent = { ...rest, [newName]: paramSpec };
    return this.updateAndRefresh(updatedContent);
  }

  deleteParamSpec(configSpecName: string, paramName: string): Observable<TdParamSpecs> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [paramName]: _removed, ...updatedContent } = this.content;
    return this.updateAndRefresh(updatedContent);
  }

  getParamSpecsInfos(): Observable<TdCompleteEditParamSpecDict> {
    return this.formTemplateService.getParamSpecsInfos();
  }

  private updateAndRefresh(updatedContent: TdParamSpecs): Observable<TdParamSpecs> {
    return this.formTemplateService
      .updateVersion(this.templateId, this.versionId, { content: updatedContent })
      .pipe(
        map((version: LiFormTemplateVersion) => {
          this.content = version.content ?? updatedContent;
          this.setParamSpecs(this.content);
          return this.content;
        })
      );
  }
}
