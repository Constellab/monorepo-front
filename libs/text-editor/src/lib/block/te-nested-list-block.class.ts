import NestedList from '@editorjs/nested-list';
import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {TeHelper} from '../model/te.helper';

export class TeNestedListBlock extends NestedList implements BlockTool {


  constructor(private options: BlockToolConstructorOptions) {
    super(options);
  }

  save(block: HTMLElement): BlockToolData {
    return super.save(block);
  }

  render(): HTMLElement {
    const node = super.render();

    if (!this.options.readOnly) {
      node.addEventListener('keydown', (event: KeyboardEvent) =>
        TeHelper.convertBlockToParagraphIfEmpty(event, node, this.options));
    }

    return node;
  }
}
