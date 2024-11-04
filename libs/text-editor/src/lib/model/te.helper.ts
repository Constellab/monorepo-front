import {
  FlHtmlHelper,
  FlKeyboardKey,
  FlOverlayRef,
  FlPortalAbsolutePosition,
  flRootInjector,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { ClHelpService } from '@monorepo/core-lib';
import { SanitizerConfig } from '@editorjs/editorjs/types/configs';
import { TeBlockListData, TeBlockListType } from './lib';

/**
 * Helper to complete the text editor api
 */
export class TeHelper {
  public static blockClass = 'ce-block';
  public static blockDropTargetClass = 'ce-block--drop-target';
  public static blockParagraphClass = 'ce-paragraph';
  public static blockParagraphTagName = 'DIV';

  private static globalOverlay: FlOverlayRef;

  /**
   * Extract the editor id from the editor html block element
   * @param element
   */
  public static getBlockIdFromElement(element: Element): string | null {
    return element.getAttribute('data-id');
  }

  public static getBlockIdFromElementOrChild(element: HTMLElement): string | null {
    const blockElement = TeHelper.getBlockElementFromElementOrChild(element);
    if (blockElement == null) return null;
    return TeHelper.getBlockIdFromElement(blockElement);
  }

  public static getBlockElementFromElementOrChild(element: HTMLElement): HTMLElement | null {
    return FlHtmlHelper.getParent(element, { className: TeHelper.blockClass });
  }

  /**
   * Get the block if of the ce-block--drop-target block if it exists (useful for drag and drop)
   * @param editorHtml
   */
  public static getBlockDropTargetId(editorHtml: HTMLElement): string | null {
    if (editorHtml == null) return null;
    const blockTarget = TeHelper.getBlockTargetElement(editorHtml);
    if (blockTarget == null) return null;
    return TeHelper.getBlockIdFromElement(blockTarget);
  }

  public static getBlockTargetElement(editorHtml: HTMLElement): HTMLElement | null {
    return editorHtml.querySelector(`.${TeHelper.blockDropTargetClass}`);
  }

  /**
   * Generate a material icon element
   * @param icon
   */
  public static getMatIconElement(icon: string): string {
    return `<span class="material-icons-outlined">${icon}</span>`;
  }

  public static getTranslateService(): FlTranslateService {
    return flRootInjector.get(FlTranslateService);
  }

  /**
   * Generate a tune button with style to be used in tune menu
   */
  public static generateTuneButton(title: string, icon: string): HTMLElement {
    const button = document.createElement('div');
    button.classList.add('ce-popover-item');
    button.innerHTML = `<div class="ce-popover-item__icon ce-popover-item__icon--tool">
          ${TeHelper.getMatIconElement(icon)}</div><div class="ce-popover-item__title">${title}
      </div>`;
    return button;
  }

  /**
   * For inline tools when wrapping, this get the text of the selected range
   * @param fragment
   */
  public static extractTextFromDocumentFragment(fragment: DocumentFragment): string {
    let text = '';

    const children: HTMLElement[] = Array.from(fragment.childNodes) as any;
    children.forEach((node) => {
      if (node.innerText) {
        text += node.innerText;
      } else if (node.textContent) {
        text += node.textContent;
      }
    });
    return text;
  }

  /**
   * Return true if the element is included in a block paragraph and
   * the block paragraph has contenteditable = true
   * @param element
   */
  public static parentBlockParagraphIsEditable(element: HTMLElement): boolean {
    const block = FlHtmlHelper.getParent(element, { className: TeHelper.blockParagraphClass });
    if (block == null) return false;
    return block.getAttribute('contenteditable') === 'true';
  }

  public static getListData(text: string, listType: TeBlockListType = 'unordered'): TeBlockListData {
    return {
      style: listType,
      meta: {},
      items: [
        {
          content: text,
          meta: {},
          items: [],
        },
      ],
    };
  }

  /**
   * Method to convert a block to a paragraph if the block is empty and the backspace key is pressed
   * @param event
   * @param node
   * @param options
   */
  public static convertBlockToParagraphIfEmpty(
    event: KeyboardEvent,
    node: HTMLElement,
    options: BlockToolConstructorOptions
  ): boolean {
    // if key is backspace and the text is empty, convert to text
    if (event.key == FlKeyboardKey.BACKSPACE && node.innerText.trim() == '') {
      // cancel the backspace event
      ClHelpService.stopEventPropagation(event);

      const index = options.api.blocks.getBlockIndex(options.block.id);

      options.api.blocks.delete(index);
      options.api.blocks.insert('paragraph', {}, null, index);

      // set the caret on the new paragraph element
      options.api.caret.setToBlock(index, 'start');
      return true;
    }
    return false;

    // if key is backspace and the cursor is at the beginning of the text, convert to text
    // like notion but hard to implement
    // if (event.key == FlKeyboardKey.BACKSPACE && window.getSelection().anchorOffset == 0) {
    //   // cancel the backspace event
    //   ClHelpService.stopEventPropagation(event);
    //
    //   const index = options.api.blocks.getBlockIndex(options.block.id);
    //   const content = node.innerText;
    //
    //   options.api.blocks.delete(index);
    //   options.api.blocks.insert('paragraph', {
    //     text: content
    //   }, null, index);
    //
    //   // set the caret on the new paragraph element
    //   options.api.caret.setToBlock(index, 'start');
    // }
  }

  /**
   * When the cursor if at the end of the line, inside an inline tool, create a space on the right arrow
   * This is to prevent the cursor from moving to the next block.
   * @param event
   * @private
   */
  public static handleRightArrow(event: KeyboardEvent): void {
    // get the element where the caret is with standard browser api
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const node = range.endContainer;
    const cursorContainer: HTMLElement = node.parentNode as HTMLElement;

    const editableContainer = FlHtmlHelper.getParent(cursorContainer, {
      attribute: { contenteditable: 'true' },
    });

    if (!editableContainer || !node) return;

    let lastChild = editableContainer.lastChild;
    if (lastChild.nodeType === Node.TEXT_NODE && lastChild.textContent === '') {
      lastChild = lastChild.parentElement;
    }

    // if the cursor is at the end of the element
    if (range.endOffset === node.textContent.length) {
      // Case where there is nothing after the cursor
      if (cursorContainer === lastChild) {
        // Append a space to the end of the div's content
        editableContainer.innerHTML += '&nbsp;';

        ClHelpService.stopEventPropagation(event);
        FlHtmlHelper.setCaretAtElementEnd(editableContainer);

        // Case where there is only a space after the cursor
        // we don't add the space as it is already there, but we move the cursor to the end of the div
        // TODO check if this is fixed in next version of editorjs current
        //  (2.30.2) because this was working before
      } else if (lastChild.previousSibling === cursorContainer && lastChild.textContent.trim() === '') {
        ClHelpService.stopEventPropagation(event);
        FlHtmlHelper.setCaretAtElementEnd(lastChild);
      }
    }
  }

  /**
   * Get the position of the portal under the cursor
   * @param portalMaxWidth max width of the portal to prevent being outside screen
   * @param portalMaxHeight max height of the portal to prevent being outside screen
   * */
  public static getPortalPositionForCursor(
    portalMaxWidth: number,
    portalMaxHeight: number
  ): FlPortalAbsolutePosition {
    const position = FlHtmlHelper.getCaretCoordinates();

    let topPosition: string;

    if (position.top + portalMaxHeight + 20 > window.innerHeight) {
      topPosition = window.innerHeight - portalMaxHeight + 'px';
    } else {
      // add 20 to the top position to make sure the portal is below the cursor
      topPosition = position.top + 20 + 'px';
    }

    // check if the emoji picker is not outside the window
    let leftPosition: string;
    if (position.left + portalMaxWidth > window.innerWidth) {
      leftPosition = window.innerWidth - portalMaxWidth + 'px';
    } else {
      leftPosition = position.left + 'px';
    }
    return { top: topPosition, left: leftPosition };
  }

  public static overlayIsOpen(): boolean {
    return TeHelper.globalOverlay != null;
  }

  public static setOverlay(overlay: FlOverlayRef): void {
    TeHelper.globalOverlay = overlay;
  }

  public static clearOverlay(): void {
    TeHelper.globalOverlay = null;
  }

  /**
   * Get sanitize config to allow all inline tools
   */
  public static getInlineToolSanitizeConfig(includeBr: boolean = false): SanitizerConfig {
    const config: SanitizerConfig = {
      b: true,
      i: true,
      u: true,
      strike: true,
      a: {
        href: true,
      },
      code: true,
    };
    if (includeBr) {
      config['br'] = true;
    }
    return config;
  }

  /**
   * Hollow a block element
   * @param blockId
   * @param color
   * @param editorElement
   */
  public static hollowElement(blockId: string, color: string, editorElement: HTMLElement): void {
    const element: HTMLElement = editorElement.querySelector('.ce-block[data-id="' + blockId + '"]');
    if (element) {
      element.style.backgroundColor = color;
      element.style.padding = '4px';
      element.style.margin = '4px';
    }
  }

  /**
   * Get the redactor element
   */
  public static getRedactorElement(): HTMLElement{
    return document.querySelector('.codex-editor__redactor');
  }
}
