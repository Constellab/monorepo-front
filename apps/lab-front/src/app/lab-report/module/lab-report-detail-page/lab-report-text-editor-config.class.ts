import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  teInlineToolFactory,
  TeTools,
  TeUploadedImage,
  TeVariableInlineToolClass
} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {LabReportContentViewBlock} from './lab-report-content-view.block';
import {LabReportService} from '../../../lab-core/entity-service/lab-report.service';
import {Observable} from 'rxjs';

export class LabReportTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(private reportService?: LabReportService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    if(!this.reportService){
      console.error('No report service to upload the image');
      return null;
    }
    return this.reportService.uploadImage(file);
  }

  getImageUrl(filename: string): string {
    if(!this.reportService){
      console.error('No report service to get the image url');
      return null;
    }
    return this.reportService.getImageUrl(filename);
  }


}

/**
 * Config for the text editor in the report to support view in the editor
 */
export class LabReportTextEditorConfig extends TeCompleteConfig {

  constructor(private reportId?: string,
              private reportService?: LabReportService) {
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
    tools.resourceView = teComponentBlockFactory(LabReportContentViewBlock, envInjector, applicationRef, this.reportId);

    // configure and add the image block
    const imageConfig = new LabReportTextEditorImageConfig(this.reportService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass, envInjector, applicationRef);

    return tools;
  }

  getInlineToolbar(): string[] {
    const toolbar = super.getInlineToolbar();
    toolbar.push('variable');
    return toolbar;
  }
}
