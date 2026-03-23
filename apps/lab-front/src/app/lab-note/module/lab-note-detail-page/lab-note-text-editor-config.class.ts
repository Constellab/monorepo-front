import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LiNoteService,
  LiRichTextAudioTranscriptionConfig,
  LiRichTextFileConfig,
  LiRichTextImageConfig,
  LiRichTextObjectType,
} from '@monorepo/lab-lib/li-core';
import {
  LiRichTextFileViewBlock,
  LiRichTextViewBlock,
  LiRichTextViewBlockAdditionalData,
} from '@monorepo/lab-lib/li-rich-text';
import {
  teBlockTuneFactory,
  TeCompleteConfig,
  teComponentBlockFactory,
  teInlineToolFactory,
  TeRichText,
  TeTools,
  TeVariableInlineToolClass,
} from '@monorepo/text-editor';
import { map, Observable } from 'rxjs';

import {
  LabNoteInsertTemplateBlockTune,
  LabNoteInsertTemplateBlockTuneConfig,
} from './model/lab-note-insert-template-block-tune.class';

/**
 * Config for the text editor in the note to support view in the editor
 */
export class LabNoteTextEditorConfig extends TeCompleteConfig {
  constructor(
    private noteId: string,
    private noteService?: LiNoteService
  ) {
    super();
  }

  override refreshContent$(): Observable<TeRichText> | null {
    if (this.noteService == null) return null;
    return this.noteService.getNoteContent(this.noteId).pipe(map((dto) => new TeRichText(dto)));
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // add the view block
    const data: LiRichTextViewBlockAdditionalData = {
      type: 'note',
      entityId: this.noteId,
    };
    tools.resourceView = teComponentBlockFactory(LiRichTextViewBlock, envInjector, applicationRef, data);

    // add the file view block
    const fileViewData: LiRichTextViewBlockAdditionalData = {
      type: 'note-file-view',
      entityId: this.noteId,
    };
    tools.fileView = teComponentBlockFactory(
      LiRichTextFileViewBlock,
      envInjector,
      applicationRef,
      fileViewData
    );

    // configure and add the image block
    const imageConfig = new LiRichTextImageConfig(LiRichTextObjectType.NOTE, this.noteId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(
      new LiRichTextFileConfig(LiRichTextObjectType.NOTE, this.noteId),
      envInjector,
      applicationRef
    );

    // block tune
    tools.audioTranscription = this.getAudioTranscriptionConfig(
      new LiRichTextAudioTranscriptionConfig(),
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
