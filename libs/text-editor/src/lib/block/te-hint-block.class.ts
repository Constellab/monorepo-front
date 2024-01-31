import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {TeHelper} from '../model/te.helper';

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
        icon: TeHelper.getMatIconElement('info'),
        title: translateService.translate('teTextEditor.hint_classic'),
        data: {
          hintType: 'info',
        } as TeHintBlockData,

      },
      {
        icon: TeHelper.getMatIconElement('warning'),
        title: translateService.translate('teTextEditor.hint_warning'),
        data: {
          hintType: 'warning',
        } as TeHintBlockData,
      },
      {
        icon: TeHelper.getMatIconElement('biotech'),
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
    return this.data.hintType ?? 'info';
  }

  render(): HTMLElement {
    this.htmlElement = document.createElement('div');
    this.htmlElement.classList.add(`g-te-hint-${this.hintType}`);
    this.htmlElement.classList.add(`g-te-hint`);
    this.htmlElement.classList.add(`g-te-block`);
    this.htmlElement.setAttribute('contenteditable', 'true');

    if (this.data.content) {
      const sanitizer = flRootInjector.get(DomSanitizer);
      // convert the \n to divs
      const divs = this.data.content.split('\n');
      for (const div of divs) {
        if (!div || div.length === 0) {
          this.htmlElement.innerHTML += `<div><br></div>`;
        } else {
          this.htmlElement.innerHTML += sanitizer.sanitize(SecurityContext.HTML, `<div>${div}</div>`);
        }
      }
    } else {
      this.htmlElement.innerHTML += `<div><br></div>`;
    }

    return this.htmlElement;
  }


  save(): TeHintBlockData {
    return {
      hintType: this.data.hintType,
      // save the content without the divs and replace them by \n
      content: this.htmlElement.innerHTML
        .replace(/<\/div><div>/g, '\n')
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, ''),
    };
  }
}
