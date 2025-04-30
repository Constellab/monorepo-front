import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';
import { Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { HaStoryContentViewComponent } from './ha-story-content-view/ha-story-content-view.component';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { ClStringHelper } from '@monorepo/core-lib';
import {
  HaStoryResourceViewInputDialogComponent,
  HaStoryResourceViewInputDialogOutputData,
} from './ha-story-resource-view-input-dialog/ha-story-resource-view-input-dialog.component';

export interface HaStoryViewConfig {
  filename: string;
  id: string;
  title: string;
  caption: string;
}

export class HaStoryContentViewBlock extends TeComponentBlock<HaStoryContentViewComponent> {
  public static readonly TAG_NAME = 'ha-story-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('resource_view'),
      icon: TeHelper.getMatIconElement('add_chart'),
    };
  }

  getComponentType(): Type<HaStoryContentViewComponent> {
    return HaStoryContentViewComponent;
  }

  getTagName(): string {
    return HaStoryContentViewBlock.TAG_NAME;
  }

  initInputs(data: HaStoryViewConfig): void {
    this.componentInstance.viewConfig = data;

    // load the view
    const storyService = this.envInjector.get(HaStoryService);

    if (data.filename == null) return;
    this.componentInstance.view$ = storyService.getView(this.additionalData, data.filename);
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
    dialogService
      .openSmallDialog(HaStoryResourceViewInputDialogComponent, { data: { storyId: this.additionalData } })
      .afterClosed()
      .subscribe((res) => this.insertResourceView(res));
  }

  private insertResourceView(res?: HaStoryResourceViewInputDialogOutputData): void {
    if (res == null || res.filename == null || res.view == null) {
      this.destroy();
      this.options.api.blocks.delete(this.options.api.blocks.getBlockIndex(this.options.block.id));
      return;
    }
    this.options.data = {
      id: ClStringHelper.generateUUID() + '_' + new Date().getTime(),
      filename: res.filename,
      title: res.view.title,
      caption: null,
    };
    this.initInputs(this.data);
  }
}
