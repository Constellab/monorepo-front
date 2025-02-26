import {
  FlDynamicAbstractFormDirective,
  FlDynamicFieldAbstractDirective,
  FlDynamicFieldAdditionalConfig,
  FlDynamicFieldConfigService,
  FlDynamicFieldConfigUnknown,
  FlDynamicGroupAdditionalConfig,
} from '@monorepo/front-core-lib/fl-dynamic-field';

import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {
  tdCodeParamSpecTypeList,
  TdDynamicEditableFormGroupComponent,
  TdParamSpecType,
} from '@monorepo/technical-doc';

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
      space_folder_param: this.buildSelectFolderField,
      rich_text_param: this.buildRichTextField,
    };

    // for each code spec type, set the code editor component
    for (const codeSpec of tdCodeParamSpecTypeList) {
      config[codeSpec] = this.buildCodeEditorField;
    }
    return config;
  }

  /**
   * Use dynamic import to avoid circular dependencies as this class import lot of component
   * @param viewContainer
   * @private
   */
  private async buildTagField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import('./component/lab-tag-dynamic-field/lab-tag-dynamic-field.component');
    return viewContainer.createComponent(type.LabTagDynamicFieldComponent);
  }

  private async buildCodeEditorField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      './component/lab-code-editor-dynamic-field/lab-code-editor-dynamic-field.component'
    );
    const component = viewContainer.createComponent(type.LabCodeEditorDynamicFieldComponent);
    component.instance.specType = config.type as TdParamSpecType;
    return component;
  }

  private async buildOpenAiChatField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../lab-open-ai-core/component/lab-open-ai-chat-dynamic-field/lab-open-ai-chat-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LabOpenAiChatDynamicFieldComponent);
  }

  private async buildSelectCredentialsField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      // eslint-disable-next-line max-len
      '../lab-credentials-core/component/lab-select-credentials-dynamic-field/lab-select-credentials-dynamic-field.component'
    );
    const component = viewContainer.createComponent(type.LabSelectCredentialsDynamicFieldComponent);
    // the additional info is the type of credentials to select (can be null)
    component.instance.type = config.additionalInfo?.credentialsType ?? null;
    return component;
  }

  private async buildSelectNoteTemplateField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      // eslint-disable-next-line max-len
      '../lab-note-template-core/component/lab-select-note-template-dynamic-field/lab-select-note-template-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LabSelectNoteTemplateDynamicFieldComponent);
  }

  private async buildSelectNoteField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../lab-note-core/component/lab-select-note-dynamic-field/lab-select-note-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LabSelectNoteDynamicFieldComponent);
  }

  private async buildSelectScenarioField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      // eslint-disable-next-line max-len
      '../lab-scenario-core/component/lab-select-scenario-dynamic-field/lab-select-scenario-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LabSelectScenarioDynamicFieldComponent);
  }

  private async buildSelectFolderField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../lab-folder-core/component/lab-select-folder-dynamic-field/lab-select-folder-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LabSelectFolderDynamicFieldComponent);
  }

  private async buildRichTextField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../lab-rich-text-core/component/lab-rich-text-dynamic-field/lab-rich-text-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LabRichTextDynamicFieldComponent);
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
