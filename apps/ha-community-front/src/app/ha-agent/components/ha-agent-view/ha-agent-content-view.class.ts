import { Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';

import {
  HaResourceViewInputDialogComponent,
  HaResourceViewInputDialogData,
  HaResourceViewInputDialogOutputData,
} from '../../../ha-core/ha-component/ha-resource-view-input-dialog/ha-resource-view-input-dialog.component';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAgentContentViewComponent } from './ha-agent-content-view/ha-agent-content-view.component';

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
    const agentService = this.envInjector.get(HaAgentService);
    const data: HaResourceViewInputDialogData = {
      entityId: this.additionalData,
      headerTranslationKey: 'add_a_view_to_the_agent',
      uploadFn: (entityId, file) => agentService.uploadResourceViewFile(entityId, file),
    };
    dialogService
      .openSmallDialog(HaResourceViewInputDialogComponent, { data })
      .afterClosed()
      .subscribe((res) => this.insertResourceView(res));
  }

  private insertResourceView(res?: HaResourceViewInputDialogOutputData): void {
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
