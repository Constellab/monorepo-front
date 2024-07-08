import {TeComponentBlock, TeHelper} from '@monorepo/text-editor';
import {Type} from '@angular/core';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {HaLiveTaskContentViewComponent} from './ha-live-task-content-view/ha-live-task-content-view.component';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {FlDialogService} from '@monorepo/front-core-lib';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {
  HaLiveTaskResourceViewInputDialogComponent, HaLiveTaskResourceViewInputDialogOutputData
} from './ha-live-task-resource-view-input-dialog/ha-live-task-resource-view-input-dialog.component';

export interface HaLiveTaskViewConfig {
  filename: string;
  id: string;
  title: string;
  caption: string;
  resource_id: string;
}

export class HaLiveTaskContentViewBlock extends TeComponentBlock<HaLiveTaskContentViewComponent> {

  public static readonly TAG_NAME = 'ha-live-task-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('resource_view'),
      icon: TeHelper.getMatIconElement('add_chart'),
    };
  }

  getComponentType(): Type<HaLiveTaskContentViewComponent> {
    return HaLiveTaskContentViewComponent;
  }

  getTagName(): string {
    return HaLiveTaskContentViewBlock.TAG_NAME;
  }

  initInputs(data: HaLiveTaskViewConfig): void {
    this.componentInstance.viewConfig = data;

    // load the view
    const liveTaskService = this.envInjector.get(HaLiveTaskService);

    if (data.filename == null) return;
    this.componentInstance.view$ = liveTaskService.getView(this.additionalData, data.filename);
  }

  // this is only for read only mode
  save(): BlockToolData {
    return this.data;
  }

  override appendCallback(): void {
    this.openSelectResourceView();
  }

  public openSelectResourceView(): void {
    const dialogService: FlDialogService = this.envInjector.get(FlDialogService);
    dialogService.openSmallDialog(HaLiveTaskResourceViewInputDialogComponent, {data: {liveTaskId: this.additionalData}}).afterClosed()
      .subscribe(res => this.insertResourceView(res));
  }

  private insertResourceView(res?: HaLiveTaskResourceViewInputDialogOutputData): void {
    if (res == null || res.filename == null || res.view == null) {
      this.destroy();
      this.options.api.blocks.delete(this.options.api.blocks.getBlockIndex(this.options.block.id));
      return;
    }
    this.options.data = {
      id: ClStringHelper.generateUUID() + '_' + new Date().getTime(),
      filename: res.filename,
      title: res.view.title,
      caption: null
    };
    this.initInputs(this.data);
  }
}


