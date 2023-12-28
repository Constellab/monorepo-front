import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeTools,
  TeUploadedImage
} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {LabReportContentViewBlot} from './lab-report-content-view.block';
import {LabReportService} from '../../../lab-core/entity-service/lab-report.service';
import {Observable} from 'rxjs';

export class LabReportTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(private reportService?: LabReportService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.reportService.uploadImage(file);
  }

  getImageUrl(filename: string): string {
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
    tools.view = teComponentBlockFactory(LabReportContentViewBlot, envInjector, applicationRef, this.reportId);

    // configure and add the image block
    const imageConfig = new LabReportTextEditorImageConfig(this.reportService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return tools;
  }
}
