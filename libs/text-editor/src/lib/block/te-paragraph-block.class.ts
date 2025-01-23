import Paragraph from '@editorjs/paragraph';
import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { TeHelper } from '../model/te.helper';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';
import { TeBlockListType } from '../model/lib';

/**
 * Standard paragraph with custom actions
 */
export class TeParagraphBlock extends Paragraph implements BlockTool {
  node: HTMLElement;

  constructor(private options: BlockToolConstructorOptions) {
    super(options);
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('teTextEditor.text'),
      icon: 'Aa',
    };
  }

  save(block: HTMLElement): BlockToolData {
    return super.save(block);
  }

  render(): HTMLElement {
    this.node = super.render();

    if (!this.options.readOnly) {
      this.node.addEventListener('keyup', (event: KeyboardEvent) => this.handleKeyUp(event));
      this.node.addEventListener('keydown', (event: KeyboardEvent) => this.handleKeyDown(event));
    }
    this.options.api;

    return this.node;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const toList = this.checkAndCovertToList(event.target as HTMLElement);
    if (toList) return;
  }

  /**
   * Check if the block should be converted to a list block and convert it
   * Convert if the block starts with '- ' or '1.'
   * @param target
   * @private
   */
  private checkAndCovertToList(target: HTMLElement): boolean {
    const innerText = target.innerHTML.replace('&nbsp;', ' ');
    if (innerText.startsWith('- ') || innerText.startsWith('1. ')) {
      const blockId = this.options.block.id;
      const index = this.options.api.blocks.getBlockIndex(this.options.block.id);

      // get the content without the bullet point and list type
      let content: string;
      let listType: TeBlockListType;
      if (innerText.startsWith('- ')) {
        content = innerText.replace('- ', '');
        listType = 'unordered';
      } else {
        content = innerText.replace('1.', '');
        listType = 'ordered';
      }

      // convert the block to a list block
      this.options.api.blocks.convert(blockId, 'list', TeHelper.getListData(content, listType));

      // set the caret on the new list element
      setTimeout(() => {
        this.options.api.caret.setToBlock(index, 'start');
      }, 0);

      return true;
    }
    return false;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === FlKeyboardKey.ARROW_RIGHT) {
      TeHelper.handleRightArrow(event);
    }
  }
}
