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
import { LabResourceENoteService } from '../../../entity-service/lab-resource-enote.service';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  LabRichTextViewBlock,
  LabRichTextViewBlockAdditionalData
} from '../../lab-rich-text-core/lab-rich-text-view.block';


export class LabENoteTextEditorImageConfig implements TeFigureBlockConfig {

  private enoteService: LabResourceENoteService;

  constructor(private enoteResourceId: string) {
    this.enoteService = flRootInjector.get(LabResourceENoteService);
  }

  imageUploader(): Observable<TeUploadedImage> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.enoteService.getFilePath(this.enoteResourceId, filename);
  }
}

export class LabENoteTextEditorFileConfig implements TeFileBlockConfig {

  private enoteService: LabResourceENoteService;

  constructor(private enoteResourceId: string) {
    this.enoteService = flRootInjector.get(LabResourceENoteService);
  }

  fileUploader(file: File): Observable<TeFileBlockData> {
    throw new Error('Method not implemented.');
  }

  getFileUrl(filename: string): string {
    return this.enoteService.getFilePath(this.enoteResourceId, filename);
  }
}


/**
 * Config for the text editor for enote. This retrieves the files from the enote resource and
 * enote resource service
 */
export class LabEnoteTextEditorConfig extends TeCompleteConfig {

  constructor(private enoteResourceId: string) {
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
      type: 'enote',
      entityId: this.enoteResourceId
    }
    tools.enoteView = teComponentBlockFactory(LabRichTextViewBlock, envInjector, applicationRef, data);

    // configure and add the image block
    const imageConfig = new LabENoteTextEditorImageConfig(this.enoteResourceId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    const fileConfig = new LabENoteTextEditorFileConfig(this.enoteResourceId);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    return tools;
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode', 'variable', 'cleanStyle'];
  }
}
