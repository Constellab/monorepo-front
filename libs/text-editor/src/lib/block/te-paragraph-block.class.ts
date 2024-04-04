import Paragraph from '@editorjs/paragraph';
import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {TeHelper, TeListType} from '../model/te.helper';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';

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
      this.node.addEventListener('keyup',
        (event: KeyboardEvent) => this.checkAndCovertToList(event.target as HTMLElement));
    }

    return this.node;
  }

  /**
   * Check if the block should be converted to a list block and convert it
   * Convert if the block starts with '- ' or '1.'
   * @param target
   * @private
   */
  private checkAndCovertToList(target: HTMLElement): void {
    const innerText = target.innerHTML.replace('&nbsp;', ' ');
    if (innerText.startsWith('- ') || innerText.startsWith('1. ')) {
      const blockId = TeHelper.getBlockIdFromElementOrChild(target);
      const index = this.options.api.blocks.getBlockIndex(this.options.block.id);

      // get the content without the bullet point and list type
      let content: string;
      let listType: TeListType;
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

    }
  }
}
