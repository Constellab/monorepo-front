import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';
import { Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { HaAgentContentViewComponent } from './ha-agent-content-view/ha-agent-content-view.component';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlDialogService } from '@monorepo/front-core-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import {
  HaAgentResourceViewInputDialogComponent,
  HaAgentResourceViewInputDialogOutputData,
} from './ha-agent-resource-view-input-dialog/ha-agent-resource-view-input-dialog.component';

export interface HaAgentViewConfig {
  filename: string;
  id: string;
  title: string;
  caption: string;
}

export class HaAgentContentViewBlock extends TeComponentBlock<HaAgentContentViewComponent> {
  public static readonly TAG_NAME = 'ha-agent-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('resource_view'),
      icon: TeHelper.getMatIconElement('add_chart'),
    };
  }

  getComponentType(): Type<HaAgentContentViewComponent> {
    return HaAgentContentViewComponent;
  }

  getTagName(): string {
    return HaAgentContentViewBlock.TAG_NAME;
  }

  initInputs(data: HaAgentViewConfig): void {
    this.componentInstance.viewConfig = data;

    // load the view
    const agentService = this.envInjector.get(HaAgentService);

    if (data.filename == null) return;
    this.componentInstance.view$ = agentService.getView(this.additionalData, data.filename);
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
      .openSmallDialog(HaAgentResourceViewInputDialogComponent, { data: { agentId: this.additionalData } })
      .afterClosed()
      .subscribe((res) => this.insertResourceView(res));
  }

  private insertResourceView(res?: HaAgentResourceViewInputDialogOutputData): void {
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
