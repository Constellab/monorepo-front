import { CaReportService } from '../../../../ca-core/service-api/ca-report.service';
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
import { CaReportRichTextViewBlock, CaReportRichTextViewBlockAdditionalData } from './ca-report-rich-text-view.block';

export class CaReportTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private reportService: CaReportService,
              private reportId: string) {
  }

  imageUploader(): Observable<TeUploadedImage> {
    throw new Error('Method not implemented.');
  }

  getImageUrl(filename: string): string {
    return this.reportService.getFileUrl(this.reportId, filename);
  }
}

export class CaRichTextFileConfig implements TeFileBlockConfig {

  constructor(private reportService: CaReportService,
              private reportId: string) {
  }

  fileUploader(): Observable<TeFileBlockData> {
    throw new Error('Method not implemented.');
  }

  getFileUrl(filename: string): string {
    return this.reportService.getFileUrl(this.reportId, filename);
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
    const additionalData: CaReportRichTextViewBlockAdditionalData = {
      type: 'resourceView',
      reportId: this.reportId
    };
    tools.resourceView = teComponentBlockFactory(CaReportRichTextViewBlock, envInjector, applicationRef, additionalData);

    // add the file view block
    const additionalData2: CaReportRichTextViewBlockAdditionalData = {
      type: 'fileView',
      reportId: this.reportId
    };
    tools.fileView = teComponentBlockFactory(CaReportRichTextViewBlock, envInjector, applicationRef, additionalData2);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass);

    tools.file = this.getFileConfig(new CaRichTextFileConfig(this.reportService, this.reportId), envInjector, applicationRef);

    return tools;
  }

  getInlineToolbar(): string[] {
    return this.getFullInlineToolbar(true);
  }

}

