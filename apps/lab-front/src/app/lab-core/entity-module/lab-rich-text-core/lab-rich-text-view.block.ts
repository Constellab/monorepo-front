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
import { RvViewConfig } from '@monorepo/resource-view';

export interface LabReportContentViewBlockAdditionalData {
  type: 'report' | 'enote';
  entityId: string; // if type is report, id of the report, if enote, id of the enote
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
 *
 */
export class LabRichTextViewBlock extends TeComponentBlock<LabRichTextViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              protected readonly additionalData: LabReportContentViewBlockAdditionalData) {
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

  initInputs(data: LabReportContentView | LabENoteContentView): void {
    const viewConfig: RvViewConfig = {
      methodName: data.view_method_name,
      configValues: data.view_config
    };
    if (this.additionalData.type === 'report') {
      const reportData = data as LabReportContentView;
      this.componentInstance.setReportInput(reportData.resource_id,
        viewConfig,
        reportData.title,
        reportData.caption
      );
    } else {
      const enoteData = data as LabENoteContentView;
      this.componentInstance.setEnoteInput(this.additionalData.entityId, enoteData.sub_resource_key,
        viewConfig, enoteData.title, enoteData.caption);
    }
  }

  save(): BlockToolData {
    return Object.assign(this.data, {
      title: this.componentInstance.viewTitle,
      caption: this.componentInstance.caption
    });
  }

  // ignore the formula if it is empty
  validate(blockData: LabReportContentView): boolean {
    return blockData.resource_id && blockData.view_config != null;
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

  // renderSettings(): HTMLElement | TunesMenuConfig {
  //   return [{
  //     icon: '<span class="material-icons-outlined">edit</span>',
  //     title: this.translateService.translate('flTextEditor.edit_formula'),
  //     onActivate: () => this.componentInstance.updateFormula(),
  //   }];
  // }


}

