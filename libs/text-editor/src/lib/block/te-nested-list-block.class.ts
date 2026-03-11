import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import List from '@editorjs/list';
import { FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';

import { TeBlockListData } from '../model/lib';
import { TeHelper } from '../model/te.helper';

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

      // Fix: both the list plugin and EditorJS core call Range.setStart/setEnd
      // with textContent.length as offset on Element nodes (e.g. formula).
      // setStart/setEnd on an Element expects a child-node index, not a character offset.
      // This causes IndexSizeError when inline elements are present.
      // We temporarily patch Range.setStart/setEnd during Enter and Backspace
      // to redirect invalid offsets to the correct position in the parent element.
      node.addEventListener('keydown', (event: KeyboardEvent) => {
        if (
          (event.key === FlKeyboardKey.ENTER && !event.shiftKey) ||
          event.key === FlKeyboardKey.BACKSPACE
        ) {
          this.patchRangeForInlineElements();
        }
      }, true);
    }

    return node;
  }

  /**
   * Temporarily patch Range.prototype.setStart and setEnd to fix invalid offsets.
   *
   * Both the list plugin and EditorJS core resolve the caret via getCaretNodeAndOffset,
   * which can return [element, element.textContent.length] when the caret is adjacent
   * to an inline element (e.g. formula). textContent.length is a character count,
   * but setStart/setEnd on an Element expects a child-node index.
   *
   * Instead of clamping to childNodes.length (which would place the range INSIDE
   * the element and cause content duplication on extractContents), we navigate up
   * to the parent and position the range AFTER the element.
   *
   * The patch is removed asynchronously after the event finishes propagating.
   */
  private patchRangeForInlineElements(): void {
    const originalSetStart = Range.prototype.setStart;
    const originalSetEnd = Range.prototype.setEnd;

    const fixOffset = (node: Node, offset: number): [Node, number] => {
      if (node.nodeType === Node.ELEMENT_NODE && offset > node.childNodes.length) {
        if (node.parentNode) {
          const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
          return [node.parentNode, index + 1];
        }
        return [node, node.childNodes.length];
      }
      return [node, offset];
    };

    Range.prototype.setStart = function (node: Node, offset: number): void {
      [node, offset] = fixOffset(node, offset);
      return originalSetStart.call(this, node, offset);
    };

    Range.prototype.setEnd = function (node: Node, offset: number): void {
      [node, offset] = fixOffset(node, offset);
      return originalSetEnd.call(this, node, offset);
    };

    setTimeout(() => {
      Range.prototype.setStart = originalSetStart;
      Range.prototype.setEnd = originalSetEnd;
    }, 0);
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
