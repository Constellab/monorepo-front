import {CaReportService} from '../../../../ca-core/service-api/ca-report.service';
import {Observable} from 'rxjs';
import {CaResourceView} from '../../../../ca-core/model/entities/project/ca-report.class';
import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeTools,
  TeUploadedImage
} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {CaReportContentViewBlock} from './ca-report-content-view.class';
import {CaTextEditorConfig} from '../../ca-text-editor/model/ca-text-editor-config.class';
import {CaTextEditorImageLoader} from '../../ca-text-editor/model/ca-text-editor-image.class';
import {
  CaQuillConfig,
  CaTextEditorBlockAddButton,
  CaTextEditorSnowButton
} from '../../ca-text-editor/model/ca-text-editor.class';

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
export class CaReportTextEditorConfig2 extends TeCompleteConfig {
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

    return tools;
  }
}


/**
 * Config for the text editor in the report
 */
export class CaReportTextEditorConfig extends CaTextEditorConfig implements CaTextEditorImageLoader {

  constructor(private reportService: CaReportService, private reportId: string) {
    super();
  }

  getToolbarConfig(): any {
    return CaQuillConfig.completeToolbarConfig;
  }

  getBlockAddButtons(): CaTextEditorBlockAddButton[] {
    return [];
  }


  public getImageUrl(filename: string): string {
    return this.reportService.getImageUrl(this.reportId, filename);
  }

  public getView(filename: string): Observable<CaResourceView> {
    return this.reportService.getView(this.reportId, filename);
  }

  onPasteImage(): any {
    return null;
  }

  getSnowButtons(): CaTextEditorSnowButton[] {
    return [];
  }
}
