import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

export type TeHintType = 'info' | 'warning' | 'science';

export interface TeHintBlockData {
  hintType: TeHintType;
  content: string;
}

/**
 * Hint block
 */
export class TeHintBlock implements BlockTool {

  private htmlElement: HTMLElement;


  constructor(protected options: BlockToolConstructorOptions) {

  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get enableLineBreaks(): boolean {
    return true;
  }

  static get toolbox(): ToolboxConfig {
    const translateService = flRootInjector.get(FlTranslateService);
    return [
      {
        icon: '<span class="material-icons-outlined">info</span>',
        title: translateService.translate('teTextEditor.hint_classic'),
        data: {
          hintType: 'info',
        } as TeHintBlockData,

      },
      {
        icon: '<span class="material-icons-outlined">warning</span>',
        title: translateService.translate('teTextEditor.hint_warning'),
        data: {
          hintType: 'warning',
        } as TeHintBlockData,
      },
      {
        icon: '<span class="material-icons-outlined">biotech</span>',
        title: translateService.translate('teTextEditor.hint_scientific'),
        data: {
          hintType: 'science',
        } as TeHintBlockData,
      }
    ];
  }

  get data(): TeHintBlockData {
    return this.options.data;
  }

  get hintType(): TeHintType {
    return this.data.hintType;
  }

  render(): HTMLElement {
    this.htmlElement = document.createElement('div');
    this.htmlElement.classList.add(`g-te-hint-${this.hintType}`);
    this.htmlElement.classList.add(`g-te-hint`);
    this.htmlElement.setAttribute('contenteditable', 'true');

    if (this.data.content) {
      const sanitizer = flRootInjector.get(DomSanitizer);
      this.htmlElement.innerHTML = sanitizer.sanitize(SecurityContext.HTML, this.data.content);
    }

    return this.htmlElement;
  }


  save(): TeHintBlockData {
    const sanitizer = flRootInjector.get(DomSanitizer);
    return {
      hintType: 'info',
      content: sanitizer.sanitize(SecurityContext.HTML, this.htmlElement.innerHTML),
    };
  }
}
