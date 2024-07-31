import { LabRichTextViewComponent } from './component/lab-rich-text-view/lab-rich-text-view.component';
import { PrConfigValues } from '@monorepo/protocol';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  LabSelectViewConfigDialogComponent
} from '../lab-view-config-core/component/lab-select-view-config-dialog/lab-select-view-config-dialog.component';
import { LabViewConfig } from '../../model/entities/resource/lab-view-config.entity';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { LabRichTextObjectType } from '../../entity-service/lab-rich-text.service';

export interface LabRichTextViewBlockAdditionalData {
  type: 'report' | 'enote' | 'report-file-view' | 'document-template-view-file';
  /**
   * if report, id of the report,
   * if enote, id of the enote,
   * if report-file-view, id of the report
   * if document-template-view-file, id of the document template
   */
  entityId: string | null;
}

/**
 * Content for the report and report template
 */
export interface LabReportContentView {
  id: string;
  resource_id: string;
  experiment_id?: string;
  view_method_name: string;
  view_config: PrConfigValues;
  title: string;
  caption: string;
}

/**
 * Content for the enote
 */
export interface LabENoteContentView {
  id: string;
  sub_resource_key: string;
  view_method_name: string;
  view_config: PrConfigValues;
  title: string;
  caption: string;
}

/**
 * Special type of view (for report) that are stored as a file and not attached to a resource
 */
export interface LabRichTextFileView {
  id: string;
  filename: string;
  title: string;
  caption: string;
}

/**
 * Block to show a resource view in the text editor
 */
export class LabRichTextViewBlock extends TeComponentBlock<LabRichTextViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              protected readonly additionalData: LabRichTextViewBlockAdditionalData) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'lab-report-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('biox.report_resource_view'),
      icon: TeHelper.getMatIconElement('add_chart')
    };
  }

  getComponentType(): Type<LabRichTextViewComponent> {
    return LabRichTextViewComponent;
  }

  getTagName(): string {
    return LabRichTextViewBlock.TAG_NAME;
  }

  initInputs(data: LabReportContentView | LabENoteContentView | LabRichTextFileView): void {
    switch (this.additionalData.type) {
      case 'report':
        const reportData = data as LabReportContentView;
        this.componentInstance.setReportInput(reportData.resource_id,
          {
            methodName: reportData.view_method_name,
            configValues: reportData.view_config
          },
          reportData.title,
          reportData.caption
        );
        break;
      case 'enote':
        const enoteData = data as LabENoteContentView;
        this.componentInstance.setEnoteInput(this.additionalData.entityId, enoteData.sub_resource_key,
          {
            methodName: enoteData.view_method_name,
            configValues: enoteData.view_config
          }, enoteData.title, enoteData.caption);
        break;
      case 'report-file-view':
      case 'document-template-view-file':
        const fileViewData = data as LabRichTextFileView;
        const objectType: LabRichTextObjectType = this.additionalData.type === 'report-file-view' ?
          LabRichTextObjectType.REPORT : LabRichTextObjectType.DOCUMENT_TEMPLATE;
        this.componentInstance.setFileViewInput(objectType, this.additionalData.entityId,
          fileViewData.filename, fileViewData.title, fileViewData.caption);
        break;
    }
  }

  save(): BlockToolData {
    return Object.assign(this.data, {
      title: this.componentInstance.viewTitle,
      caption: this.componentInstance.caption
    });
  }

  validate(blockData: LabReportContentView | LabENoteContentView | LabRichTextFileView): boolean {
    if (!blockData.id) return false;
    switch (this.additionalData.type) {
      case 'report':
        const reportData = blockData as LabReportContentView;
        return !!reportData.resource_id && reportData.view_config != null;
      case 'enote':
        const enoteData = blockData as LabENoteContentView;
        return !!enoteData.sub_resource_key && !!enoteData.view_method_name;
      case 'report-file-view':
      case 'document-template-view-file':
        const fileViewData = blockData as LabRichTextFileView;
        return !!fileViewData.filename;
    }
  }


  override appendCallback(): void {
    this.openSelectResourceView();
  }

  public openSelectResourceView(): void {
    if (this.additionalData.type === 'report') {
      const dialogService: FlDialogService = this.envInjector.get(FlDialogService);
      dialogService.openBigDialog(LabSelectViewConfigDialogComponent, { data: this.additionalData.entityId }).afterClosed()
        .subscribe(viewConfig => this.insertResourceView(viewConfig));
    }
  }

  private insertResourceView(viewConfig?: LabViewConfig): void {
    if (viewConfig == null) return;
    this.options.data = {
      id: viewConfig.id + '_' + new Date().getTime(),
      resource_id: viewConfig.resource.id,
      experiment_id: viewConfig.experiment?.id,
      view_method_name: viewConfig.viewName,
      view_config: viewConfig.configValues,
      title: viewConfig.title,
      caption: null
    };
    this.initInputs(this.data);
  }

  // renderSettings(): HTMLElement | MenuConfig {
  //   return [{
  //     icon: '<span class="material-icons-outlined">edit</span>',
  //     title: this.translateService.translate('flTextEditor.edit_formula'),
  //     onActivate: () => this.componentInstance.updateFormula(),
  //   }];
  // }


}

