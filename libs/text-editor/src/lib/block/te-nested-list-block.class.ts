import NestedList from '@editorjs/nested-list';
import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {TeHelper} from '../model/te.helper';
import {FlKeyboardKey} from '@monorepo/front-core-lib';

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
        this.handleKeyDown(event, node));
    }

    return node;
  }

  private handleKeyDown(event: KeyboardEvent, node: HTMLElement): void {
    const converted = TeHelper.convertBlockToParagraphIfEmpty(event, node, this.options);

    if (converted) return;

    if (event.key === FlKeyboardKey.ARROW_RIGHT) {
      TeHelper.handleRightArrow(event);
    }
  }
}
