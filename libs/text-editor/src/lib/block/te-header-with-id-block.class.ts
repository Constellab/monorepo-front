import Header from '@editorjs/header';
import {ClHelpService, ClStringHelper} from '@monorepo/core-lib';
import {ToolboxConfig, TunesMenuConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {FlClipboardService, FlKeyboardKey, flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {TeHelper} from '../model/te.helper';


export class TeHeaderWithIdBlockConfig {
  levels: number[];

  defaultLevel: number;

  /**
   * If true the copy link button will be shown in the tune menu
   */
  showCopyLinkButton: boolean;

  placeholder: string;
}

export function teGetHeaderWithIdBlockDefaultConfig(): TeHeaderWithIdBlockConfig {
  return {
    levels: [2, 3, 4],
    defaultLevel: 2,
    showCopyLinkButton: false,
    placeholder: TeHelper.getTranslateService().translate('teTextEditor.title')
  };
}

/**
 * Override header block to add an id attribute based on the text
 */
export class TeHeaderWithIdBlock extends Header implements BlockTool {

  node: HTMLElement;

  constructor(private options: BlockToolConstructorOptions) {
    super(options);
  }


  static get toolbox(): ToolboxConfig {
    // split the toolbox config into 3 individual buttons
    const translateService = flRootInjector.get(FlTranslateService);
    return [
      // shift 1 header level up because we don't allow h1 in the editor (for SEO purpose)
      {
        icon: 'H1',
        title: translateService.translate('teTextEditor.header_1'),
        data: {
          level: 2,
        },
      },
      {
        icon: 'H2',
        title: translateService.translate('teTextEditor.header_2'),
        data: {
          level: 3,
        },
      },
      {
        icon: 'H3',
        title: translateService.translate('teTextEditor.header_3'),
        data: {
          level: 4,
        },
      }
    ];
  }

  render(): HTMLElement {
    this.node = super.render();

    if (!this.options.readOnly) {
      this.node.addEventListener('keydown', (event: KeyboardEvent) =>
        TeHelper.convertBlockToParagraphIfEmpty(event, this.node, this.options));
    }

    if (this.node.innerText.trim() == '') return this.node;

    const id = ClStringHelper.toKebabCase(this.node.innerText);
    this.node.setAttribute('id', id);


    return this.node;
  }

  private checkAndCovertToList(event: KeyboardEvent): void {
    // if key is backspace and the text is empty, convert to text
    if (event.key == FlKeyboardKey.BACKSPACE && this.node.innerText.trim() == '') {
      const index = this.options.api.blocks.getBlockIndex(this.options.block.id);

      this.options.api.blocks.convert(this.options.block.id, 'paragraph');

      ClHelpService.stopEventPropagation(event);

      // set the caret on the new list element
      setTimeout(() => {
        this.options.api.caret.setToBlock(index, 'start');
      }, 0);
    }
  }


  save(block: HTMLElement): BlockToolData {
    return super.save(block);
  }

  get config(): TeHeaderWithIdBlockConfig {
    return this.options.config;
  }

  renderSettings(): HTMLElement | TunesMenuConfig {
    // const settings: TunesMenuConfigItem[] = super.renderSettings() as TunesMenuConfigItem[];
    // if (!this.config.showCopyLinkButton) return settings;
    const translateService = flRootInjector.get(FlTranslateService);
    const clipboardService = flRootInjector.get(FlClipboardService);

    // using code from original header : https://github.com/editor-js/header/blob/master/src/index.js
    const config: TunesMenuConfig = [
      {
        icon: 'H1',
        title: translateService.translate('teTextEditor.header_1'),
        onActivate: () => super.setLevel(2),
        closeOnActivate: true,
        isActive: super.currentLevel.number === 2,
      },
      {
        icon: 'H2',
        title: translateService.translate('teTextEditor.header_2'),
        onActivate: () => super.setLevel(3),
        closeOnActivate: true,
        isActive: super.currentLevel.number === 3,
      },
      {
        icon: 'H3',
        title: translateService.translate('teTextEditor.header_3'),
        onActivate: () => super.setLevel(4),
        closeOnActivate: true,
        isActive: super.currentLevel.number === 4,
      }
    ];

    if (this.config.showCopyLinkButton) {
      config.unshift({
        icon: TeHelper.getMatIconElement('content_copy'),
        title: translateService.translate('teTextEditor.copy_link'),
        onActivate: () => {

          if (window) {
            // copy url of the header with the anchor
            const url = window.location.href;
            const id = this.node.getAttribute('id');
            const anchor = id ? `#${id}` : '';
            clipboardService.copy(`${url}${anchor}`,
              {text: 'teTextEditor.link_copied', translateText: true});
          }
        },
      });
    }

    return config;
  }
}
