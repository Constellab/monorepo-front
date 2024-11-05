import {
  teBlockTuneFactory,
  TeCompleteConfig,
  teComponentBlockFactory,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass,
} from '@monorepo/text-editor';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LabRichTextFileViewBlock,
  LabRichTextViewBlock,
  LabRichTextViewBlockAdditionalData,
} from '../../../lab-core/entity-module/lab-rich-text-core/lab-rich-text-view.block';
import {
  LabRichTextAudioTranscriptionConfig,
  LabRichTextFileConfig,
  LabRichTextImageConfig,
  LabRichTextObjectType,
} from '../../../lab-core/entity-service/lab-rich-text.service';
import {
  LabNoteInsertTemplateBlockTune,
  LabNoteInsertTemplateBlockTuneConfig,
} from './model/lab-note-insert-template-block-tune.class';

/**
 * Config for the text editor in the note to support view in the editor
 */
export class LabNoteTextEditorConfig extends TeCompleteConfig {
  constructor(private noteId: string) {
    super();
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // add the view block
    const data: LabRichTextViewBlockAdditionalData = {
      type: 'note',
      entityId: this.noteId,
    };
    tools.resourceView = teComponentBlockFactory(LabRichTextViewBlock, envInjector, applicationRef, data);

    // add the file view block
    const fileViewData: LabRichTextViewBlockAdditionalData = {
      type: 'note-file-view',
      entityId: this.noteId,
    };
    tools.fileView = teComponentBlockFactory(
      LabRichTextFileViewBlock,
      envInjector,
      applicationRef,
      fileViewData
    );

    // configure and add the image block
    const imageConfig = new LabRichTextImageConfig(LabRichTextObjectType.NOTE, this.noteId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(
      new LabRichTextFileConfig(LabRichTextObjectType.NOTE, this.noteId),
      envInjector,
      applicationRef
    );

    // block tune
    tools.audioTranscription = this.getAudioTranscriptionConfig(
      new LabRichTextAudioTranscriptionConfig(),
      envInjector,
      applicationRef
    );

    const insertDocTemplateData: LabNoteInsertTemplateBlockTuneConfig = { noteId: this.noteId };
    tools.insertDocTemplate = teBlockTuneFactory(
      LabNoteInsertTemplateBlockTune,
      envInjector,
      applicationRef,
      insertDocTemplateData
    );
    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }

  getTunes(): string[] {
    return ['audioTranscription', 'insertDocTemplate', ...super.getTunes()];
  }
}
