import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LiRichTextAudioTranscriptionConfig,
  LiRichTextFileConfig,
  LiRichTextImageConfig,
  LiRichTextObjectType,
} from '@monorepo/lab-lib/li-core';
import {
  LiRichTextFormTemplateBlock,
  LiRichTextFormTemplateBlockAdditionalData,
} from '@monorepo/lab-lib/li-form';
import { LiRichTextFileViewBlock, LiRichTextViewBlockAdditionalData } from '@monorepo/lab-lib/li-rich-text';
import {
  TeCompleteConfig,
  teComponentBlockFactory,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass,
} from '@monorepo/text-editor';

/**
 * Config for the text editor in the note to support view in the editor
 */
export class LabNoteTemplateTextEditorConfig extends TeCompleteConfig {
  constructor(private noteTemplateId: string) {
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
    const imageConfig = new LiRichTextImageConfig(LiRichTextObjectType.NOTE_TEMPLATE, this.noteTemplateId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(
      new LiRichTextFileConfig(LiRichTextObjectType.NOTE_TEMPLATE, this.noteTemplateId),
      envInjector,
      applicationRef
    );

    // add the file view block
    const fileViewData: LiRichTextViewBlockAdditionalData = {
      type: 'note-template-view-file',
      entityId: this.noteTemplateId,
    };
    tools.fileView = teComponentBlockFactory(
      LiRichTextFileViewBlock,
      envInjector,
      applicationRef,
      fileViewData
    );

    // add the form template block
    const formTemplateData: LiRichTextFormTemplateBlockAdditionalData = {
      noteTemplateId: this.noteTemplateId,
    };
    tools.formTemplate = teComponentBlockFactory(
      LiRichTextFormTemplateBlock,
      envInjector,
      applicationRef,
      formTemplateData
    );

    tools.audioTranscription = this.getAudioTranscriptionConfig(
      new LiRichTextAudioTranscriptionConfig(),
      envInjector,
      applicationRef
    );

    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }

  getTunes(): string[] {
    return ['audioTranscription', ...super.getTunes()];
  }
}
