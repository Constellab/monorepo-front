import {LabReportContentViewComponent} from './component/lab-report-content-view/lab-report-content-view.component';
import {PrConfigValues} from '@monorepo/protocol';
import {TeComponentBlock, TeHelper} from '@monorepo/text-editor';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {ApplicationRef, EnvironmentInjector, Type} from '@angular/core';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  LabSelectViewConfigDialogComponent
} from '../../../lab-core/entity-module/lab-view-config-core/component/lab-select-view-config-dialog/lab-select-view-config-dialog.component';
import {LabViewConfig} from '../../../lab-core/model/entities/resource/lab-view-config.entity';
import {BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';


export interface LabReportContentView {
  id: string;
  resource_id: string;
  experiment_id?: string;
  view_method_name: string;
  view_config: PrConfigValues;
  title: string;
  caption: string;
}

export class LabReportContentViewBlock extends TeComponentBlock<LabReportContentViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              // additionalData is the report id
              protected readonly additionalData: string) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'lab-report-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('biox.report_resource_view'),
      icon: TeHelper.getMatIconElement('add_chart'),
    };
  }

  getComponentType(): Type<LabReportContentViewComponent> {
    return LabReportContentViewComponent;
  }

  getTagName(): string {
    return LabReportContentViewBlock.TAG_NAME;
  }

  initInputs(data: LabReportContentView): void {
    this.componentInstance.setInputs(data.resource_id,
      data.title,
      data.caption,
      {
        methodName: data.view_method_name,
        configValues: data.view_config,
      }
    );
  }

  save(): BlockToolData {
    return Object.assign(this.data, {
      title: this.componentInstance.viewTitle,
      caption: this.componentInstance.caption,
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
    const dialogService: FlDialogService = this.envInjector.get(FlDialogService);
    dialogService.openBigDialog(LabSelectViewConfigDialogComponent, {data: this.additionalData}).afterClosed()
      .subscribe(viewConfig => this.insertResourceView(viewConfig));
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

