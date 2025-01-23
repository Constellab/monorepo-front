import {
  FlDynamicAbstractFormDirective,
  FlDynamicFieldAbstractDirective,
  FlDynamicFieldAdditionalConfig,
  FlDynamicFieldConfigService,
  FlDynamicFieldConfigUnknown,
  FlDynamicGroupAdditionalConfig,
} from '@monorepo/front-core-lib/fl-dynamic-field';

import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { LabTagDynamicFieldComponent } from './component/lab-tag-dynamic-field/lab-tag-dynamic-field.component';
import {
  tdCodeParamSpecTypeList,
  TdDynamicEditableFormGroupComponent,
  TdParamSpecType,
} from '@monorepo/technical-doc';
import {
  LabOpenAiChatDynamicFieldComponent
} from '../lab-open-ai-core/component/lab-open-ai-chat-dynamic-field/lab-open-ai-chat-dynamic-field.component';
import {
  LabSelectCredentialsDynamicFieldComponent
} from '../lab-credentials-core/component/lab-select-credentials-dynamic-field/lab-select-credentials-dynamic-field.component';
import {
  LabSelectNoteDynamicFieldComponent
} from '../lab-note-core/component/lab-select-note-dynamic-field/lab-select-note-dynamic-field.component';
import {
  LabRichTextDynamicFieldComponent
} from '../lab-rich-text-core/component/lab-rich-text-dynamic-field/lab-rich-text-dynamic-field.component';
import {
  LabSelectNoteTemplateDynamicFieldComponent
} from '../lab-note-template-core/component/lab-select-note-template-dynamic-field/lab-select-note-template-dynamic-field.component';
import {
  LabSelectScenarioDynamicFieldComponent
} from '../lab-scenario-core/component/lab-select-scenario-dynamic-field/lab-select-scenario-dynamic-field.component';
import {
  LabCodeEditorDynamicFieldComponent
} from './component/lab-code-editor-dynamic-field/lab-code-editor-dynamic-field.component';

/**
 * Configuration for the DynamicField that include tags field and other custom field
 */
@Injectable()
export class LabProcessDynamicFieldConfig extends FlDynamicFieldConfigService {
  protected getAdditionalFieldConfig(): Record<string, FlDynamicFieldAdditionalConfig> {
    const config: Record<string, FlDynamicFieldAdditionalConfig> = {
      tags_param: this.buildTagField,
      open_ai_chat_param: this.buildOpenAiChatField,
      credentials_param: this.buildSelectCredentialsField,
      note_template_param: this.buildSelectNoteTemplateField,
      note_param: this.buildSelectNoteField,
      scenario_param: this.buildSelectScenarioField,
      rich_text_param: this.buildRichTextField,
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

  private buildCodeEditorField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const component = viewContainer.createComponent(LabCodeEditorDynamicFieldComponent);
    component.instance.specType = config.type as TdParamSpecType;
    return component;
  }

  private buildOpenAiChatField(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabOpenAiChatDynamicFieldComponent);
  }

  private buildSelectCredentialsField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const component = viewContainer.createComponent(LabSelectCredentialsDynamicFieldComponent);
    // the additional info is the type of credentials to select (can be null)
    component.instance.type = config.additionalInfo?.credentialsType ?? null;
    return component;
  }

  private buildSelectNoteTemplateField(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabSelectNoteTemplateDynamicFieldComponent);
  }

  private buildSelectNoteField(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabSelectNoteDynamicFieldComponent);
  }

  private buildSelectScenarioField(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabSelectScenarioDynamicFieldComponent);
  }

  private buildRichTextField(viewContainer: ViewContainerRef): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(LabRichTextDynamicFieldComponent);
  }
}

/**
 * Configuration for the DynamicField for the process dashboard
 * It includes supports for dynamic group
 */
@Injectable()
export class LabProcessDashboardDynamicFieldConfig extends LabProcessDynamicFieldConfig {
  /**
   * Add support for dynamic group
   * @protected
   */
  protected getAdditionalGroupConfig(): Record<string, FlDynamicGroupAdditionalConfig> {
    return {
      editableFormGroup: this.buildEditableFormGroup,
    };
  }

  private buildEditableFormGroup(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicAbstractFormDirective> {
    return viewContainer.createComponent(TdDynamicEditableFormGroupComponent);
  }
}
