import { Type } from '@angular/core';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';

import { TeRawHtmlComponent } from '../component/te-raw-html/te-raw-html.component';
import { TeComponentBlock } from './te-component-block.class';

export interface TeRawHtmlBlockData {
  html: string;
}

/**
 * Raw HTML block for editor js
 */
export class TeRawHtmlBlock extends TeComponentBlock<TeRawHtmlComponent> {
  public static readonly TAG_NAME = 'te-raw-html';

  /**
   * This tools cannot be created from the frontend toolbox
   */
  static override get toolbox(): ToolboxConfig {
    return {};
  }

  getComponentType(): Type<TeRawHtmlComponent> {
    return TeRawHtmlComponent;
  }

  getTagName(): string {
    return TeRawHtmlBlock.TAG_NAME;
  }

  initInputs(data: TeRawHtmlBlockData): void {
    this.componentInstance.data = data ?? { html: '' };
  }

  save(): TeRawHtmlBlockData {
    return this.componentInstance.data;
  }

  validate(blockData: TeRawHtmlBlockData): boolean {
    return blockData?.html?.length > 0;
  }
}
