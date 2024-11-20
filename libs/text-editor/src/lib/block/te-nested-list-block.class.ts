import List from '@editorjs/list';
import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { TeHelper } from '../model/te.helper';
import { FlKeyboardKey } from '@monorepo/front-core-lib';
import { TeBlockListData } from '../model/lib';

export class TeNestedListBlock extends List implements BlockTool {
  constructor(private options: BlockToolConstructorOptions) {
    super(options);
  }

  save(): TeBlockListData {
    return super.save();
  }

  render(): HTMLElement {
    const node = super.render();

    if (!this.options.readOnly) {
      node.addEventListener('keydown', (event: KeyboardEvent) => this.handleKeyDown(event, node));
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

  /**
   * Handle UL, OL and LI tags paste and returns List data
   *
   * Override default method to fix nested list
   * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
   * @returns
   */
  pasteHandler(element: HTMLElement): any {
    element = this.fixNestedList(element);
    return super.pasteHandler(element as HTMLUListElement | HTMLOListElement | HTMLLIElement);
  }

  /**
   * Method to fix some pasted nested list
   * If the nested list is not well formatted, it will fix it. This can happen when copy paste form word
   * Input :
   * <ul>
   *   <li>Coffee</li>
   *   <li>Tea</li>
   *   <ul>
   *     <li>Black tea</li>
   *   </ul>
   * </ul>
   *
   * Output :
   * <ul>
   *   <li>Coffee</li>
   *   <li>Tea
   *      <ul>
   *        <li>Black tea</li>
   *      </ul>
   *   </li>
   * </ul>
   * @param ulElement
   */
  fixNestedList(ulElement: HTMLElement): HTMLElement {
    for (let i = 0; i < ulElement.children.length; i++) {
      const child: HTMLElement = ulElement.children[i] as HTMLElement;

      if (child.tagName === 'UL') {
        this.fixNestedList(child);
        // move the ul inside the previous li
        const li = ulElement.children[i - 1];
        li.appendChild(child);
        continue;
      }

      if (child.tagName === 'LI') {
        const ul = child.querySelector('ul');
        if (ul) {
          const fixedUl = this.fixNestedList(ul);
          child.appendChild(fixedUl);
        }
      }
    }

    return ulElement;
  }
}
