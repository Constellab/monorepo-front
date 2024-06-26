import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
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
  LabReportContentViewBlock
} from '../../../../lab-report/module/lab-report-detail-page/lab-report-content-view.block';


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
    tools.resourceView = teComponentBlockFactory(LabReportContentViewBlock, envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new LabENoteTextEditorImageConfig(this.enoteResourceId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    return tools;
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode', 'variable', 'cleanStyle'];
  }
}
