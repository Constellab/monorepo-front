import { CaReportContentViewComponent } from '../component/ca-report-content-view/ca-report-content-view.component';
import { RvConfigValues } from '@monorepo/resource-view';
import { TeComponentBlock } from '@monorepo/text-editor';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';

export interface CaReportRichTextViewBlockAdditionalData {
  type: 'resourceView' | 'fileView';
  reportId: string;
}

export interface CaReportResourceViewBlockData {
  id: string;
  resource_id: string;
  view_method_name: string;
  view_config: RvConfigValues;
  title: string;
  caption: string;
}

export interface CaReportFileViewBlockData {
  id: string;
  title: string;
  caption: string;
}

export class CaReportRichTextViewBlock extends TeComponentBlock<CaReportContentViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              // additionalData is the report id
              protected readonly additionalData: CaReportRichTextViewBlockAdditionalData) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'ca-report-content-view';


  getComponentType(): Type<CaReportContentViewComponent> {
    return CaReportContentViewComponent;
  }

  getTagName(): string {
    return CaReportRichTextViewBlock.TAG_NAME;
  }

  initInputs(data: CaReportResourceViewBlockData | CaReportFileViewBlockData): void {
    let resourceId: string = null;
    if (this.additionalData.type === 'resourceView') {
      resourceId = (data as CaReportResourceViewBlockData).resource_id;
    }

    this.componentInstance.setViewInputs(this.additionalData.reportId, data.id,
      data.title, data.caption, resourceId);
  }


  // this is only for read only mode
  save(): BlockToolData {
    return this.data;
  }
}


