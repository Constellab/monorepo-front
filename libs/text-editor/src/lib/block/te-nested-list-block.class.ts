import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import List from '@editorjs/list';
import { ClHelpService } from '@monorepo/core-lib';
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
      // Capture phase: intercept backspace before the list plugin can delete the block
      node.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === FlKeyboardKey.BACKSPACE) {
          this.patchRangeForInlineElements();
          this.handleBackspace(event, node);
        } else if (event.key === FlKeyboardKey.ENTER && !event.shiftKey) {
          this.patchRangeForInlineElements();
        }
      }, true);

      node.addEventListener('keydown', (event: KeyboardEvent) => this.handleKeyDown(event, node));
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

  /**
   * Handle backspace in capture phase, before the list plugin can delete the block.
   */
  private handleBackspace(event: KeyboardEvent, node: HTMLElement): void {
    if (node.innerText.trim() === '') {
      TeHelper.convertBlockToParagraphIfEmpty(event, node, this.options);
      return;
    }

    this.convertSingleItemListToParagraph(event, node);
  }

  private handleKeyDown(event: KeyboardEvent, node: HTMLElement): void {
    if (event.key === FlKeyboardKey.ARROW_RIGHT) {
      TeHelper.handleRightArrow(event);
    }
  }

  /**
   * When backspace is pressed at the beginning of a single-item list,
   * convert the list block to a paragraph preserving the item content.
   */
  private convertSingleItemListToParagraph(event: KeyboardEvent, node: HTMLElement): void {
    const items = node.querySelectorAll('.cdx-list__item');
    if (items.length !== 1) return;

    const childrenContainer = items[0].querySelector('.cdx-list__item-children');
    if (childrenContainer && childrenContainer.children.length > 0) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!range.collapsed) return;

    const contentEl = items[0].querySelector('.cdx-list__item-content');
    if (!contentEl) return;

    if (!this.isCursorAtContentStart(range, contentEl)) return;

    ClHelpService.stopEventPropagation(event);

    const content = contentEl.innerHTML;
    const index = this.options.api.blocks.getBlockIndex(this.options.block.id);

    this.options.api.blocks.delete(index);
    this.options.api.blocks.insert('paragraph', { text: content }, null, index);
    this.options.api.caret.setToBlock(index, 'start');
  }

  /**
   * Check if the cursor (range) is at the very start of the given container element.
   */
  private isCursorAtContentStart(range: Range, container: Element): boolean {
    if (range.startOffset !== 0) return false;

    let current = range.startContainer;
    while (current && current !== container) {
      if (current.parentNode && current !== current.parentNode.firstChild) return false;
      current = current.parentNode;
    }

    return current === container;
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
