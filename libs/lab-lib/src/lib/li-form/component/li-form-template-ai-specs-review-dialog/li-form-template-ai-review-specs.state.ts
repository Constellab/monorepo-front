import {
  TdGenerateComputedParamResult,
  TdGenerateFieldResult,
  TdParamSpec,
  TdParamSpecCategory,
  TdParamSpecInfo,
  TdSubParamSpecState,
  TdValidateComputedParamResult,
} from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { LiFormTemplateService } from '../../service/li-form-template.service';

// Category display order in the form type list: advanced fields before lab-data fields.
const FORM_CATEGORY_ORDER: TdParamSpecCategory[] = [
  TdParamSpecCategory.SIMPLE,
  TdParamSpecCategory.OTHER,
  TdParamSpecCategory.LAB_SPECIFIC,
];

/**
 * In-memory specs state for the AI specs review dialog.
 *
 * The proposed field set is edited entirely locally (add / edit / delete / reorder via
 * the inherited {@link TdSubParamSpecState} behaviour) and is persisted only when the
 * user applies the whole set. Per-field AI generation and computed-expression
 * validation are routed to the template-version endpoints so they behave like the
 * regular editor; final computed-cycle validation is performed by the backend on apply.
 */
export class LiFormTemplateAiReviewSpecsState extends TdSubParamSpecState {
  constructor(
    private formTemplateService: LiFormTemplateService,
    private templateId: string,
    private versionId: string
  ) {
    super();
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

  override getParamSpecsInfos(): TdParamSpecInfo[] {
    // super already excludes param_set (no nesting). Additionally hide code params and
    // order categories so "Advanced" (other) comes before "Lab data" (lab_specific).
    return super
      .getParamSpecsInfos()
      .filter((info) => info.category !== TdParamSpecCategory.CODE)
      .sort((a, b) => FORM_CATEGORY_ORDER.indexOf(a.category) - FORM_CATEGORY_ORDER.indexOf(b.category));
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
}
