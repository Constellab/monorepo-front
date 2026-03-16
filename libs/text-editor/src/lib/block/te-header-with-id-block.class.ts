import { BlockTool, BlockToolConstructorOptions, BlockToolData, ToolboxConfig } from '@editorjs/editorjs';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import Header from '@editorjs/header';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TeEditBlockMetadataDialogComponent } from '../component/te-edit-block-metadata-dialog/te-edit-block-metadata-dialog.component';
import { TeHelper } from '../model/te.helper';
import { TeBlockWithMetadata, TeMetadataBlockConfig } from '../model/te-metadata-block-config.class';

export interface TeHeaderWithIdBlockData {
  text: string;
  level: number;
  metadata?: TeMetadataBlockConfig;
}

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
    showCopyLinkButton: true,
    placeholder: TeHelper.getTranslateService().translate('teTextEditor.title'),
  };
}

/**
 * Override header block to add an id attribute based on the text
 */
export class TeHeaderWithIdBlock extends Header implements TeBlockWithMetadata, BlockTool {
  node: HTMLElement;

  metadata: TeMetadataBlockConfig;

  constructor(private options: BlockToolConstructorOptions) {
    super(options);
    this.metadata = options.data?.metadata;
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
      },
    ];
  }

  render(): HTMLElement {
    this.node = super.render();

    if (!this.options.readOnly) {
      this.node.addEventListener('keydown', (event: KeyboardEvent) =>
        TeHelper.convertBlockToParagraphIfEmpty(event, this.node, this.options)
      );
    }

    if (this.node.innerText.trim() == '') return this.node;

    const id = TeHelper.getHeaderId(this.node.innerText);
    this.node.setAttribute('id', id);

    if (this.config.showCopyLinkButton) {
      this.addCopyLinkButton(id);

      if (this.options.readOnly) {
        this.node.style.cursor = 'pointer';
        this.node.addEventListener('click', () => this.scrollToHeader());
      }
    }

    return this.node;
  }

  private addCopyLinkButton(headerId: string): void {
    const clipboardService = flRootInjector.get(FlClipboardService);

    const button = this.node.ownerDocument.createElement('button');
    button.className = 'te-header-copy-link-btn';
    button.contentEditable = 'false';
    button.setAttribute('aria-label', 'Copy link to header');
    button.type = 'button';
    button.innerHTML = '<span class="material-icons-outlined">link</span>';

    const copyLink = (e: Event): void => {
      e.preventDefault();
      e.stopPropagation();
      const url = window.location.href.split('#')[0];
      const anchor = headerId ? `#${headerId}` : '';
      clipboardService.copy(`${url}${anchor}`, {
        text: 'teTextEditor.link_copied',
        translateText: true,
      });
      this.scrollToHeader();
    };

    button.addEventListener('click', copyLink);

    this.node.classList.add('te-header-with-copy-link');
    this.node.appendChild(button);
  }

  save(block: HTMLElement): BlockToolData {
    // Remove the copy-link button before saving so it's not included in the text
    const button = block.querySelector('.te-header-copy-link-btn');
    button?.remove();

    const savedData = super.save(block);

    // Re-add the button after saving
    if (button) {
      block.appendChild(button);
    }

    return {
      ...savedData,
      metadata: this.metadata,
    };
  }

  validate(blockData: TeHeaderWithIdBlockData): boolean {
    return blockData.text != null && blockData.level != null;
  }

  normalizeData(data: TeHeaderWithIdBlockData): TeHeaderWithIdBlockData {
    return {
      text: data.text,
      metadata: data.metadata,
      level: data.level,
    } as TeHeaderWithIdBlockData;
  }

  get config(): TeHeaderWithIdBlockConfig {
    return this.options.config;
  }

  renderSettings(): HTMLElement | MenuConfig {
    // const settings: TunesMenuConfigItem[] = super.renderSettings() as TunesMenuConfigItem[];
    // if (!this.config.showCopyLinkButton) return settings;
    const translateService = flRootInjector.get(FlTranslateService);
    const clipboardService = flRootInjector.get(FlClipboardService);

    // using code from original header : https://github.com/editor-js/header/blob/master/src/index.js
    const config: MenuConfig = [
      {
        icon: 'H1',
        title: translateService.translate('teTextEditor.header_1'),
        onActivate: () => this.changeLevel(2),
        closeOnActivate: true,
        isActive: super.currentLevel.number === 2,
      },
      {
        icon: 'H2',
        title: translateService.translate('teTextEditor.header_2'),
        onActivate: () => this.changeLevel(3),
        closeOnActivate: true,
        isActive: super.currentLevel.number === 3,
      },
      {
        icon: 'H3',
        title: translateService.translate('teTextEditor.header_3'),
        onActivate: () => this.changeLevel(4),
        closeOnActivate: true,
        isActive: super.currentLevel.number === 4,
      },
      {
        icon: TeHelper.getMatIconElement('edit'),
        title: translateService.translate('teTextEditor.edit_metadata'),
        onActivate: () => this.openMetadataDialog(),
        closeOnActivate: true,
      },
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
            clipboardService.copy(`${url}${anchor}`, {
              text: 'teTextEditor.link_copied',
              translateText: true,
            });
          }
        },
      });
    }

    return config;
  }

  openMetadataDialog(): void {
    const dialogService = flRootInjector.get(FlDialogService);
    dialogService
      .openSmallDialog(TeEditBlockMetadataDialogComponent, { data: this.metadata })
      .afterClosed()
      .subscribe((metadata: TeMetadataBlockConfig) => {
        if (metadata) {
          this.metadata = metadata;
          this.render();
        }
      });
  }

  private scrollToHeader(): void {
    this.node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private changeLevel(level: number): void {
    this.setLevel(level);
  }
}
