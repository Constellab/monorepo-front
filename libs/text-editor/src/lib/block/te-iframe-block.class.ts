import { Type } from '@angular/core';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ClStringHelper } from '@monorepo/core-lib';

import { TeIframeComponent } from '../component/te-iframe/te-iframe.component';
import { TeHelper } from '../model/te.helper';
import { TeComponentBlock } from './te-component-block.class';

export interface TeIframeBlockData {
  url: string;
  iframeHeight?: number;
}

/**
 * Figure block for editor js
 */
export class TeIframeBlock extends TeComponentBlock<TeIframeComponent> {
  public static readonly TAG_NAME = 'te-iframe';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('teTextEditor.iframe'),
      icon: TeHelper.getMatIconElement('web_asset'),
    };
  }

  getComponentType(): Type<TeIframeComponent> {
    return TeIframeComponent;
  }

  getTagName(): string {
    return TeIframeBlock.TAG_NAME;
  }

  initInputs(data: TeIframeBlockData): void {
    this.componentInstance.data = data;
  }

  save(): TeIframeBlockData {
    return this.componentInstance.data;
  }

  validate(blockData: TeIframeBlockData): boolean {
    return ClStringHelper.isHttpLink(blockData?.url);
  }

  override appendCallback(): void {
    this.componentInstance.openLinkDialog();
  }
}
