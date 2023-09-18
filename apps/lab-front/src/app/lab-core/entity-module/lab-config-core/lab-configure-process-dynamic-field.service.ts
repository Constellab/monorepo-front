import {
  FlDynamicFieldAbstractDirective,
  FlDynamicFieldAdditionalConfig,
  FlDynamicFieldConfigService,
  FlDynamicFieldConfigUnknown
} from '@monorepo/front-core-lib';
import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {LabTagDynamicFieldComponent} from './component/lab-tag-dynamic-field/lab-tag-dynamic-field.component';
import {
  LabCodeEditorDynamicFieldComponent
} from './component/lab-code-editor-dynamic-field/lab-code-editor-dynamic-field.component';
import {tdCodeParamSpecTypeList, TdParamSpecType} from '@monorepo/technical-doc';
import {
  LabOpenAiChatDynamicFieldComponent
} from '../lab-open-ai-core/component/lab-open-ai-chat-dynamic-field/lab-open-ai-chat-dynamic-field.component';
import {
  LabSelectCredentialsDynamicFieldComponent
} from '../lab-credentials-core/component/lab-select-credentials-dynamic-field/lab-select-credentials-dynamic-field.component';
import {
  LabSelectReportTemplateDynamicFieldComponent
} from '../lab-report-template-core/component/lab-select-report-template-dynamic-field/lab-select-report-template-dynamic-field.component';
import {
  LabSelectReportDynamicFieldComponent
} from '../lab-report-core/component/lab-select-report-dynamic-field/lab-select-report-dynamic-field.component';

/**
 * Configuration for the {@link FlDynamicFieldComponent} that include tags field and other custom field
 */
@Injectable()
export class LabConfigureProcessDynamicField extends FlDynamicFieldConfigService {


  protected getAdditionalConfig(): Record<string, FlDynamicFieldAdditionalConfig> {
    const config: Record<string, FlDynamicFieldAdditionalConfig> = {
      'tags': this.buildTagField,
      'open_ai_chat': this.buildOpenAiChatField,
      'select_credentials': this.buildSelectCredentialsField,
      'select_report_template': this.buildSelectReportTemplateField,
      'select_report': this.buildSelectReportField,
    };

    // for each code spec type, set the code editor component
    for (const codeSpec of tdCodeParamSpecTypeList) {
      config[codeSpec] = this.buildCodeEditorField;
    }
    return config;
  }

  private buildTagField(viewContainer: ViewContainerRef): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabTagDynamicFieldComponent);
  }

  private buildCodeEditorField(viewContainer: ViewContainerRef,
                               config: FlDynamicFieldConfigUnknown): ComponentRef<FlDynamicFieldAbstractDirective> {
    const component = viewContainer.createComponent(LabCodeEditorDynamicFieldComponent);
    component.instance.specType = config.type as TdParamSpecType;
    return component;
  }

  private buildOpenAiChatField(viewContainer: ViewContainerRef): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabOpenAiChatDynamicFieldComponent);
  }

  private buildSelectCredentialsField(viewContainer: ViewContainerRef,
                                      config: FlDynamicFieldConfigUnknown): ComponentRef<FlDynamicFieldAbstractDirective> {
    const component = viewContainer.createComponent(LabSelectCredentialsDynamicFieldComponent);
    // the additional info is the type of credentials to select (can be null)
    component.instance.type = config.additionalInfo?.credentialsType ?? null;
    return component;
  }

  private buildSelectReportTemplateField(viewContainer: ViewContainerRef): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabSelectReportTemplateDynamicFieldComponent);
  }
  private buildSelectReportField(viewContainer: ViewContainerRef): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabSelectReportDynamicFieldComponent);
  }

}
