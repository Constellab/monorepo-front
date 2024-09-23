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
import { flRootInjector } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabNoteResourceService } from '../../../entity-service/lab-note-resource.service';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LabRichTextFileViewBlock,
  LabRichTextViewBlockAdditionalData
} from '../../lab-rich-text-core/lab-rich-text-view.block';
import { LabRichTextAudioTranscriptionConfig } from '../../../entity-service/lab-rich-text.service';


export class LabNoteResourceTextEditorImageConfig implements TeFigureBlockConfig {

  private noteResourceService: LabNoteResourceService;

  constructor(private noteResourceId: string) {
    this.noteResourceService = flRootInjector.get(LabNoteResourceService);
  }

  imageUploader(): Observable<TeUploadedImage> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.noteResourceService.getFilePath(this.noteResourceId, filename);
  }
}

export class LabNoteResourceTextEditorFileConfig implements TeFileBlockConfig {

  private noteResourceService: LabNoteResourceService;

  constructor(private noteResourceId: string) {
    this.noteResourceService = flRootInjector.get(LabNoteResourceService);
  }

  fileUploader(): Observable<TeFileBlockData> {
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
export class LabNoteResourceTextEditorConfig extends TeCompleteConfig {

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
    const data: LabRichTextViewBlockAdditionalData = {
      type: 'note-resource',
      entityId: this.noteResourceId
    };
    tools.noteResourceView = teComponentBlockFactory(LabRichTextFileViewBlock, envInjector, applicationRef, data);

    // configure and add the image block
    const imageConfig = new LabNoteResourceTextEditorImageConfig(this.noteResourceId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    const fileConfig = new LabNoteResourceTextEditorFileConfig(this.noteResourceId);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

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
