import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  TeBlockFigureUploadedResponse,
  TeBlockFileUploadResponse,
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  teInlineToolFactory,
  TeTools,
  TeVariableInlineToolClass,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { CaNoteService } from '../../../../ca-core/service-api/ca-note.service';
import {
  CaNoteRichTextViewBlock,
  CaNoteRichTextViewBlockAdditionalData,
} from './ca-note-rich-text-view.block';

export class CaNoteTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private noteService: CaNoteService,
    private noteId: string,
    private hierarchyObjectToken?: string
  ) {}

  imageUploader(): Observable<TeBlockFigureUploadedResponse> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.noteService.getFileUrl(this.noteId, filename, this.hierarchyObjectToken);
  }
}

export class CaRichTextFileConfig implements TeFileBlockConfig {
  constructor(
    private noteService: CaNoteService,
    private noteId: string,
    private hierarchyObjectToken?: string
  ) {}

  fileUploader(): Observable<TeBlockFileUploadResponse> {
    throw new Error('Method not implemented.');
  }

  getFileUrl(filename: string): string {
    return this.noteService.getFileUrl(this.noteId, filename, this.hierarchyObjectToken);
  }
}

/**
 * Config for the text editor in the note
 */
export class CaNoteTextEditorConfig extends TeCompleteConfig {
  constructor(
    private noteService: CaNoteService,
    private noteId: string,
    private hierarchyObjectToken?: string
  ) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaNoteTextEditorImageConfig(
      this.noteService,
      this.noteId,
      this.hierarchyObjectToken
    );
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // add the view block
    const additionalData: CaNoteRichTextViewBlockAdditionalData = {
      type: 'resourceView',
      noteId: this.noteId,
    };
    tools.resourceView = teComponentBlockFactory(
      CaNoteRichTextViewBlock,
      envInjector,
      applicationRef,
      additionalData
    );

    // add the file view block
    const additionalData2: CaNoteRichTextViewBlockAdditionalData = {
      type: 'fileView',
      noteId: this.noteId,
    };
    tools.fileView = teComponentBlockFactory(
      CaNoteRichTextViewBlock,
      envInjector,
      applicationRef,
      additionalData2
    );

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(
      new CaRichTextFileConfig(this.noteService, this.noteId, this.hierarchyObjectToken),
      envInjector,
      applicationRef
    );

    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }
}
