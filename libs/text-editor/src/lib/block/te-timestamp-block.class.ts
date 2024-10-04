import { ClDateFormatKey } from '@monorepo/front-core-lib';
import { TeComponentBlock } from './te-component-block.class';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { TeHelper } from '../model/te.helper';
import { Type } from '@angular/core';
import { TeTimestampComponent } from '../component/te-timestamp/te-timestamp.component';
import { ClDateHelper } from '@monorepo/core-lib';

export type TeTimestampFormat = ClDateFormatKey | 'FROM_NOW';

export interface TeTimestampBlockData {
  timestamp: string;
  format: TeTimestampFormat;
}

export class TeTimestampBlock extends TeComponentBlock<TeTimestampComponent> {

  public static readonly TAG_NAME = 'te-timestamp';

  static override get toolbox(): ToolboxConfig {
    const translateService = TeHelper.getTranslateService();
    return [
      {
        icon: TeHelper.getMatIconElement('schedule'),
        title: translateService.translate('teTextEditor.timestamp')
      }
    ];
  }

  getComponentType(): Type<TeTimestampComponent> {
    return TeTimestampComponent;
  }

  getTagName(): string {
    return TeTimestampBlock.TAG_NAME;
  }

  initInputs(data: TeTimestampBlockData): void {
    this.componentInstance.timestamp = ClDateHelper.getDate(data.timestamp) ?? ClDateHelper.getDate();
    this.componentInstance.format = data.format;
  }

  save(): TeTimestampBlockData {
    return {
      timestamp: ClDateHelper.serializeDateTime(this.componentInstance.timestamp),
      format: this.componentInstance.format
    };
  }

  validate(blockData: TeTimestampBlockData): boolean {
    return ClDateHelper.getDate(blockData.timestamp).isValid;
  }
}
