import { Type } from '@angular/core';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlDateFormatKey } from '@monorepo/front-core-lib/fl-date';

import { TeTimestampComponent } from '../component/te-timestamp/te-timestamp.component';
import { TeHelper } from '../model/te.helper';
import { TeComponentBlock } from './te-component-block.class';

export type TeTimestampFormat = FlDateFormatKey | 'FROM_NOW';

export interface TeTimestampBlockData {
  timestamp: string | null;
  format?: TeTimestampFormat;
}

export class TeTimestampBlock extends TeComponentBlock<TeTimestampComponent> {
  public static readonly TAG_NAME = 'te-timestamp';

  static override get toolbox(): ToolboxConfig {
    const translateService = TeHelper.getTranslateService();
    return [
      {
        icon: TeHelper.getMatIconElement('schedule'),
        title: translateService.translate('teTextEditor.timestamp'),
      },
    ];
  }

  getComponentType(): Type<TeTimestampComponent> {
    return TeTimestampComponent;
  }

  getTagName(): string {
    return TeTimestampBlock.TAG_NAME;
  }

  initInputs(data: TeTimestampBlockData): void {
    this.componentInstance.timestamp = ClDateHelper.getDate(data.timestamp ?? undefined);
    this.componentInstance.format = data.format;
  }

  save(): TeTimestampBlockData {
    return {
      timestamp: ClDateHelper.serializeDateTime(this.componentInstance.timestamp),
      format: this.componentInstance.format,
    };
  }

  validate(blockData: TeTimestampBlockData): boolean {
    return ClDateHelper.getDate(blockData.timestamp ?? undefined).isValid;
  }
}
