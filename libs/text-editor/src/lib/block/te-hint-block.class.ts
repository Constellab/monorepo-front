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

  private node: HTMLElement;


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
    this.node = document.createElement('div');
    this.node.classList.add(`g-te-hint-${this.hintType}`);
    this.node.classList.add(`g-te-hint`);
    this.node.classList.add(`g-te-block`);

    if (!this.options.readOnly) {
      this.node.setAttribute('contenteditable', 'true');
      this.node.addEventListener('keydown', (event: KeyboardEvent) =>
        TeHelper.convertBlockToParagraphIfEmpty(event, this.node, this.options));
    }

    if (this.data.content) {
      const sanitizer = flRootInjector.get(DomSanitizer);
      // convert the \n to divs
      const divs = this.data.content.split('\n');
      for (const div of divs) {
        if (!div || div.length === 0) {
          this.node.innerHTML += `<div><br></div>`;
        } else {
          this.node.innerHTML += sanitizer.sanitize(SecurityContext.HTML, `<div>${div}</div>`);
        }
      }
    } else {
      this.node.innerHTML += `<div><br></div>`;
    }

    return this.node;
  }


  save(): TeHintBlockData {
    return {
      hintType: this.data.hintType,
      // save the content without the divs and replace them by \n
      content: this.node.innerHTML
        .replace(/<\/div><div>/g, '\n')
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, ''),
    };
  }
}
