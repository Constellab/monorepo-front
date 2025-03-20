import { TeHelper } from '../model/te.helper';
import { TeBlockWithMetadata, TeMetadataBlockConfig } from '../model/te-metadata-block-config.class';
import Header from '@editorjs/header';
import { BlockTool, BlockToolConstructorOptions, BlockToolData, ToolboxConfig } from '@editorjs/editorjs';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeEditBlockMetadataDialogComponent } from '../component/te-edit-block-metadata-dialog/te-edit-block-metadata-dialog.component';

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
    showCopyLinkButton: false,
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

    let id = ClStringHelper.toKebabCase(this.node.innerText);
    //remove all special characters and numbers
    id = id.replace(/[^a-zA-Z-]/g, '');
    this.node.setAttribute('id', id);

    return this.node;
  }

  save(block: HTMLElement): BlockToolData {
    super.save(block);
    return {
      ...this.data,
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

  private changeLevel(level: number): void {
    this.setLevel(level);
  }
}
