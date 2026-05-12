import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';

import { LiRichTextFormTemplateComponent } from './component/li-rich-text-form-template/li-rich-text-form-template.component';
import {
  LiRichTextFormTemplateBlockAdditionalData,
  LiRichTextFormTemplateBlockData,
} from './model/li-rich-text-form-template-block.model';

export class LiRichTextFormTemplateBlock extends TeComponentBlock<LiRichTextFormTemplateComponent> {
  public static readonly TAG_NAME = 'li-note-content-form-template';

  constructor(
    protected options: BlockToolConstructorOptions,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected readonly additionalData: LiRichTextFormTemplateBlockAdditionalData
  ) {
    super(options, envInjector, applicationRef, additionalData);
  }

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('li.form_insert_template'),
      icon: TeHelper.getMatIconElement('description'),
    };
  }

  getComponentType(): Type<LiRichTextFormTemplateComponent> {
    return LiRichTextFormTemplateComponent;
  }

  getTagName(): string {
    return LiRichTextFormTemplateBlock.TAG_NAME;
  }

  initInputs(data: LiRichTextFormTemplateBlockData): void {
    this.componentInstance.formTemplateId = data?.form_template_id;
    this.componentInstance.formTemplateVersionId = data?.form_template_version_id;
    this.componentInstance.displayName = data?.display_name;

    if (data?.form_template_id && data?.form_template_version_id) {
      this.componentInstance.loadVersionInfo(
        data.form_template_id,
        data.form_template_version_id,
        data.display_name
      );
    }
  }

  save(): BlockToolData {
    return {
      form_template_id: this.componentInstance.formTemplateId,
      form_template_version_id: this.componentInstance.formTemplateVersionId,
      display_name: this.componentInstance.displayName,
    };
  }

  validate(data: LiRichTextFormTemplateBlockData): boolean {
    return !!data.form_template_id && !!data.form_template_version_id;
  }

  override appendCallback(): void {
    this.componentInstance.openSelectTemplate();
  }
}
