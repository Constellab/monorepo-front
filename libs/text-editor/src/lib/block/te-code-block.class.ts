import { Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PasteEvent } from '@editorjs/editorjs';
import { PasteConfig } from '@editorjs/editorjs/types/configs/paste-config';
import { HTMLPasteEvent } from '@editorjs/editorjs/types/tools/paste-events';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlCodeEditorLanguage, flDetectLanguage } from '@monorepo/front-core-lib/fl-code-editor';

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

  static override get pasteConfig(): PasteConfig {
    return {
      tags: ['pre'],
    };
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

  onPaste(event: PasteEvent): void {
    if (event.type === 'tag') {
      // Handle pasting from HTML <pre> or <code> tags
      const element = (event as HTMLPasteEvent).detail.data;

      if (element.tagName !== 'PRE') return;

      let code = '';
      let language = null;

      code = element.textContent || '';

      // remove last new line if exists
      if (code.endsWith('\n')) {
        code = code.slice(0, -1);
      }
      const classList = Array.from(element.classList);
      const langClass = classList.find((cls) => cls.startsWith('language-') || cls.startsWith('lang-'));
      if (langClass) {
        language = langClass.replace(/^(language-|lang-)/, '');
      }

      if (!language) {
        // try to detect language from code content
        language = flDetectLanguage(code);
      }

      if (code) {
        // TODO : when this is called (only on paste), the language is
        // not correctly set in the code editor (because it is set after the creation)
        // but the correct language is saved
        this.componentInstance.setValue(code, language);
      }
    }
  }
}
