import {
  TdGenerateComputedParamResult,
  TdGenerateFieldResult,
  TdParamSpec,
  TdParamSpecInfo,
  TdSubParamSpecState,
  TdValidateComputedParamResult,
} from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { liFilterAndOrderFormTemplateParamSpecsInfos } from '../../../li-core/model/entities/form/li-form-template.entity';
import { LiFormTemplateService } from '../../service/li-form-template.service';

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
    return liFilterAndOrderFormTemplateParamSpecsInfos();
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
