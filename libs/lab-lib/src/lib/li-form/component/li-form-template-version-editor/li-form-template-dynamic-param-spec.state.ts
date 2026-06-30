import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TdAbstractDynamicParamSpecState,
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
  TdGenerateComputedParamResult,
  TdGenerateFieldResult,
  TdParamSpec,
  TdParamSpecCategory,
  TdParamSpecEntry,
  TdParamSpecInfo,
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

  override reorderEnabled = true;

  setVersionContent(templateId: string, versionId: string, content: TdParamSpecs): void {
    this.templateId = templateId;
    this.versionId = versionId;
    this.setParamSpecs(content ?? {});
  }

  openConfigureParamSpecsTableDialog(): void {
    throw new Error('Method not implemented. Use openParamSpecFormDialog instead.');
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
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result: TdParamSpecs) => {
        if (result) {
          this.setParamSpecs(result);
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

  override generateComputedExpression(
    description: string,
    paramSetKey?: string
  ): Observable<TdGenerateComputedParamResult> {
    return this.formTemplateService.generateComputedParam(
      this.templateId,
      this.versionId,
      description,
      paramSetKey
    );
  }

  // Category display order in the form type list: advanced fields before lab-data fields.
  private static readonly CATEGORY_ORDER: TdParamSpecCategory[] = [
    TdParamSpecCategory.SIMPLE,
    TdParamSpecCategory.OTHER,
    TdParamSpecCategory.LAB_SPECIFIC,
  ];

  override getParamSpecsInfos(): TdParamSpecInfo[] {
    const order = LiFormTemplateDynamicParamSpecState.CATEGORY_ORDER;
    // Hide code params (not relevant for form templates) and order the remaining
    // categories so "Advanced" (other) comes before "Lab data" (lab_specific).
    return super
      .getParamSpecsInfos()
      .filter((info) => info.category !== TdParamSpecCategory.CODE)
      .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  }

  override supportsFieldGeneration(): boolean {
    return true;
  }

  override generateField(
    description: string,
    fieldKey?: string,
    currentField?: TdParamSpec
  ): Observable<TdGenerateFieldResult> {
    return this.formTemplateService.generateFieldWithAi(
      this.templateId,
      this.versionId,
      description,
      fieldKey,
      currentField
    );
  }

  /**
   * Generates a proposed full field set from a description (preview only — not persisted).
   * Apply the reviewed result through {@link LiFormTemplateService.setAllFields}.
   */
  generateSpecsWithAi(description: string): Observable<TdParamSpecs> {
    return this.formTemplateService.generateSpecsWithAi(this.templateId, this.versionId, description);
  }

  private refreshContent(version: LiFormTemplateVersion): TdParamSpecs {
    const specs = version.content ?? {};
    this.setParamSpecs(specs);
    return specs;
  }
}
