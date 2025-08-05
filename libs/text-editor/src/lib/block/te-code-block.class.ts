import { Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlCodeEditorLanguage } from '@monorepo/front-core-lib/fl-code-editor';

import { TeCodeComponent } from '../component/te-code/te-code.component';
import { TeHelper } from '../model/te.helper';
import { TeComponentBlock } from './te-component-block.class';

export interface TeCodeBlockData {
  code: string;
  language: string;
}

export class TeCodeBlock extends TeComponentBlock<TeCodeComponent> {
  public static readonly TAG_NAME = 'te-code';

  static override get toolbox(): ToolboxConfig {
    const translateService = TeHelper.getTranslateService();
    return [
      {
        icon: TeHelper.getMatIconElement('code'),
        title: translateService.translate('teTextEditor.code'),
      },
    ];
  }

  getComponentType(): Type<TeCodeComponent> {
    return TeCodeComponent;
  }

  getTagName(): string {
    return TeCodeBlock.TAG_NAME;
  }

  initInputs(data: TeCodeBlockData): void {
    this.componentInstance.formControl = new FormControl({ value: data.code, disabled: this.disabled });
    this.componentInstance.language = (data.language as FlCodeEditorLanguage) ?? 'python';
  }

  save(): TeCodeBlockData {
    return {
      code: this.componentInstance.formControl.value,
      language: this.componentInstance.language,
    };
  }

  // ignore the formula if it is empty
  validate(blockData: TeCodeBlockData): boolean {
    return blockData.code?.length > 0;
  }
}
