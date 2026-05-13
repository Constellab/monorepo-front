import { inject, Injectable, OnDestroy, signal, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TdAbstractDynamicParamSpecState,
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
  TdParamSpec,
  TdParamSpecEntry,
  TdParamSpecs,
  TdValidateComputedParamResult,
} from '@monorepo/technical-doc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LiFormTemplateVersion } from '../../../li-core/model/entities/form/li-form-template-version.entity';
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

  reorderEnabled = signal(true);

  setVersionContent(templateId: string, versionId: string, content: TdParamSpecs): void {
    this.templateId = templateId;
    this.versionId = versionId;
    this.content = content ?? {};
    this.setParamSpecs(this.content);
  }

  openConfigureParamSpecsTableDialog(): void {
    throw new Error('Method not implemented. Use openParamSpecFormDialog instead.');
  }

  getContent(): TdParamSpecs {
    return this.content;
  }

  openParamSpecFormDialog(entry?: TdParamSpecEntry, onUpdated?: () => void): void {
    const input: TdEditParamSpecDialogInput = {
      dynamicParamSpecState: this,
      paramSpec: entry,
      title: { text: entry ? 'li.form_edit_field' : 'li.form_add_field', translateText: true },
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
          onUpdated?.();
        }
      });
  }

  addParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.formTemplateService
      .createField(this.templateId, this.versionId, paramName, paramSpec)
      .pipe(map((version) => this.refreshContent(version)));
  }

  editParamSpec(paramName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.formTemplateService
      .updateField(this.templateId, this.versionId, paramName, paramSpec)
      .pipe(map((version) => this.refreshContent(version)));
  }

  renameAndEditParamSpec(oldName: string, newName: string, paramSpec: TdParamSpec): Observable<TdParamSpecs> {
    return this.formTemplateService
      .renameAndUpdateField(this.templateId, this.versionId, oldName, newName, paramSpec)
      .pipe(map((version) => this.refreshContent(version)));
  }

  deleteParamSpec(paramName: string): Observable<TdParamSpecs> {
    return this.formTemplateService
      .deleteField(this.templateId, this.versionId, paramName)
      .pipe(map((version) => this.refreshContent(version)));
  }

  override validateComputedExpression(
    expression: string,
    key?: string,
    paramSetKey?: string
  ): Observable<TdValidateComputedParamResult> {
    return this.formTemplateService.validateComputedParam(
      this.templateId,
      this.versionId,
      expression,
      key,
      paramSetKey
    );
  }

  reorderParamSpecs(fieldNames: string[]): Observable<TdParamSpecs> {
    return this.formTemplateService
      .reorderFields(this.templateId, this.versionId, fieldNames)
      .pipe(map((version) => this.refreshContent(version)));
  }

  private refreshContent(version: LiFormTemplateVersion): TdParamSpecs {
    this.content = version.content ?? {};
    this.setParamSpecs(this.content);
    return this.content;
  }
}
