import {CaReportService} from '../../../../ca-core/service-api/ca-report.service';
import {Observable} from 'rxjs';
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
import {CaReportContentViewBlock} from './ca-report-content-view.class';

export class CaReportTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private reportService: CaReportService,
              private reportId: string) {
  }

  imageUploader(): Observable<TeUploadedImage> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.reportService.getImageUrl(this.reportId, filename);
  }
}

/**
 * Config for the text editor in the report
 */
export class CaReportTextEditorConfig extends TeCompleteConfig {
  constructor(private reportService: CaReportService,
              private reportId: string) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaReportTextEditorImageConfig(
      this.reportService, this.reportId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // add the view block
    tools.resourceView = teComponentBlockFactory(CaReportContentViewBlock, envInjector, applicationRef, this.reportId);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    return tools;
  }

  getInlineToolbar(): string[] {
    return ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode', 'variable', 'cleanStyle'];
  }

}

