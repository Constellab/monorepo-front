import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { LiNoteResourceService, LiRichTextAudioTranscriptionConfig } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';
import {
  TeBlockFigureUploadedResponse,
  TeBlockFileUploadResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeTools,
  TeVariableInlineToolClass,
  teComponentBlockFactory,
  teInlineToolFactory,
} from '@monorepo/text-editor';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { LiRichTextFileViewBlock, LiRichTextViewBlockAdditionalData } from '@monorepo/lab-lib/li-rich-text';

export class LiNoteResourceTextEditorImageConfig implements TeFigureBlockConfig {
  private noteResourceService: LiNoteResourceService;

  constructor(private noteResourceId: string) {
    this.noteResourceService = flRootInjector.get(LiNoteResourceService);
  }

  imageUploader(): Observable<TeBlockFigureUploadedResponse> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.noteResourceService.getFilePath(this.noteResourceId, filename);
  }
}

export class LiNoteResourceTextEditorFileConfig implements TeFileBlockConfig {
  private noteResourceService: LiNoteResourceService;

  constructor(private noteResourceId: string) {
    this.noteResourceService = flRootInjector.get(LiNoteResourceService);
  }

  fileUploader(): Observable<TeBlockFileUploadResponse> {
    throw new Error('Method not implemented.');
  }

  getFileUrl(filename: string): string {
    return this.noteResourceService.getFilePath(this.noteResourceId, filename);
  }
}

/**
 * Config for the text editor for note resource. This retrieves the files from the note resource resource and
 * note resource service
 */
export class LiNoteResourceTextEditorConfig extends TeCompleteConfig {
  constructor(private noteResourceId: string) {
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
    const data: LiRichTextViewBlockAdditionalData = {
      type: 'note-resource',
      entityId: this.noteResourceId,
    };
    tools.noteResourceView = teComponentBlockFactory(
      LiRichTextFileViewBlock,
      envInjector,
      applicationRef,
      data
    );

    // configure and add the image block
    const imageConfig = new LiNoteResourceTextEditorImageConfig(this.noteResourceId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    const fileConfig = new LiNoteResourceTextEditorFileConfig(this.noteResourceId);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

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
