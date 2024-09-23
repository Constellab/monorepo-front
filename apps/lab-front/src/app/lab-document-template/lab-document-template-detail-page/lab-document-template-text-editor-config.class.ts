import {
  TeCompleteConfig,
  teComponentBlockFactory,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass
} from '@monorepo/text-editor';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LabRichTextAudioTranscriptionConfig,
  LabRichTextFileConfig,
  LabRichTextImageConfig,
  LabRichTextObjectType
} from '../../lab-core/entity-service/lab-rich-text.service';
import {
  LabRichTextFileViewBlock,
  LabRichTextViewBlockAdditionalData
} from '../../lab-core/entity-module/lab-rich-text-core/lab-rich-text-view.block';


/**
 * Config for the text editor in the note to support view in the editor
 */
export class LabDocumentTemplateTextEditorConfig extends TeCompleteConfig {

  constructor(private documentTemplateId: string) {
    super();
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new LabRichTextImageConfig(LabRichTextObjectType.DOCUMENT_TEMPLATE, this.documentTemplateId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(new LabRichTextFileConfig(LabRichTextObjectType.DOCUMENT_TEMPLATE,
      this.documentTemplateId), envInjector, applicationRef);

    // add the file view block
    const fileViewData: LabRichTextViewBlockAdditionalData = {
      type: 'document-template-view-file',
      entityId: this.documentTemplateId
    };
    tools.fileView = teComponentBlockFactory(LabRichTextFileViewBlock, envInjector, applicationRef, fileViewData);

    tools.audioTranscription = this.getAudioTranscriptionConfig(new LabRichTextAudioTranscriptionConfig(), envInjector, applicationRef);

    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }

  getTunes(): string[] {
    return ['audioTranscription', ...super.getTunes()];
  }
}
