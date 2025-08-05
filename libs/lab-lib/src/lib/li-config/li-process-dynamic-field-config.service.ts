import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {
  FlDynamicAbstractFormDirective,
  FlDynamicFieldAbstractDirective,
  FlDynamicFieldAdditionalConfig,
  FlDynamicFieldConfigService,
  FlDynamicFieldConfigUnknown,
  FlDynamicGroupAdditionalConfig,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import {
  tdCodeParamSpecTypeList,
  TdDynamicEditableFormGroupComponent,
  TdParamSpecType,
} from '@monorepo/technical-doc';

/**
 * Configuration for the DynamicField that include tags field and other custom field
 */
@Injectable()
export class LiProcessDynamicFieldConfig extends FlDynamicFieldConfigService {
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
    const type = await import('./component/li-tag-dynamic-field/li-tag-dynamic-field.component');
    return viewContainer.createComponent(type.LiTagDynamicFieldComponent);
  }

  private async buildCodeEditorField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      './component/li-code-editor-dynamic-field/li-code-editor-dynamic-field.component'
    );
    const component = viewContainer.createComponent(type.LiCodeEditorDynamicFieldComponent);
    component.instance.specType = config.type as TdParamSpecType;
    return component;
  }

  private async buildOpenAiChatField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../li-open-ai/component/li-open-ai-chat-dynamic-field/li-open-ai-chat-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LiOpenAiChatDynamicFieldComponent);
  }

  private async buildSelectCredentialsField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      // eslint-disable-next-line max-len
      '../li-credentials/component/li-select-credentials-dynamic-field/li-select-credentials-dynamic-field.component'
    );
    const component = viewContainer.createComponent(type.LiSelectCredentialsDynamicFieldComponent);
    // the additional info is the type of credentials to select (can be null)
    component.instance.type = config.additionalInfo?.credentialsType ?? null;
    return component;
  }

  private async buildSelectNoteTemplateField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      // eslint-disable-next-line max-len
      '../li-note-template/component/li-select-note-template-dynamic-field/li-select-note-template-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LiSelectNoteTemplateDynamicFieldComponent);
  }

  private async buildSelectNoteField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../li-note/component/li-select-note-dynamic-field/li-select-note-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LiSelectNoteDynamicFieldComponent);
  }

  private async buildSelectScenarioField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      // eslint-disable-next-line max-len
      '../li-scenario/component/li-select-scenario-dynamic-field/li-select-scenario-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LiSelectScenarioDynamicFieldComponent);
  }

  private async buildSelectFolderField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../li-folder/component/li-select-folder-dynamic-field/li-select-folder-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LiSelectFolderDynamicFieldComponent);
  }

  private async buildRichTextField(
    viewContainer: ViewContainerRef
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import(
      '../li-rich-text/component/li-rich-text-dynamic-field/li-rich-text-dynamic-field.component'
    );
    return viewContainer.createComponent(type.LiRichTextDynamicFieldComponent);
  }
}

/**
 * Configuration for the DynamicField for the process dashboard
 * It includes supports for dynamic group
 */
@Injectable()
export class LiProcessDashboardDynamicFieldConfig extends LiProcessDynamicFieldConfig {
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
