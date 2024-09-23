import { CaNoteService } from '../../../../ca-core/service-api/ca-note.service';
import { Observable } from 'rxjs';
import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeFileBlockData,
  teInlineToolFactory,
  TeTools,
  TeUploadedImage,
  TeVariableInlineToolClass
} from '@monorepo/text-editor';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { CaNoteRichTextViewBlock, CaNoteRichTextViewBlockAdditionalData } from './ca-note-rich-text-view.block';

export class CaNoteTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private noteService: CaNoteService,
              private noteId: string) {
  }

  imageUploader(): Observable<TeUploadedImage> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.noteService.getFileUrl(this.noteId, filename);
  }
}

export class CaRichTextFileConfig implements TeFileBlockConfig {

  constructor(private noteService: CaNoteService,
              private noteId: string) {
  }

  fileUploader(): Observable<TeFileBlockData> {
    throw new Error('Method not implemented.');
  }

  getFileUrl(filename: string): string {
    return this.noteService.getFileUrl(this.noteId, filename);
  }
}

/**
 * Config for the text editor in the note
 */
export class CaNoteTextEditorConfig extends TeCompleteConfig {
  constructor(private noteService: CaNoteService,
              private noteId: string) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaNoteTextEditorImageConfig(
      this.noteService, this.noteId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // add the view block
    const additionalData: CaNoteRichTextViewBlockAdditionalData = {
      type: 'resourceView',
      noteId: this.noteId
    };
    tools.resourceView = teComponentBlockFactory(CaNoteRichTextViewBlock, envInjector, applicationRef, additionalData);

    // add the file view block
    const additionalData2: CaNoteRichTextViewBlockAdditionalData = {
      type: 'fileView',
      noteId: this.noteId
    };
    tools.fileView = teComponentBlockFactory(CaNoteRichTextViewBlock, envInjector, applicationRef, additionalData2);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(new CaRichTextFileConfig(this.noteService, this.noteId), envInjector, applicationRef);

    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }

}

