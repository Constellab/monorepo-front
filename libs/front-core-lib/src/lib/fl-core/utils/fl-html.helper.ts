import { ScrollDispatcher } from '@angular/cdk/overlay';

import { FL_ROOT_INJECTOR } from './fl-root-injector';

export interface FlHtmlFindParentOptions {
  className?: string;
  tagName?: string;
  element?: HTMLElement;
  attribute?: Record<string, string>;
}

/**
 * Helper to manage HTML
 */
export class FlHtmlHelper {
  public static domTokenListToArray(tokenList: DOMTokenList): string[] {
    const array: string[] = [];
    for (let i = 0; i < tokenList.length; i++) {
      const item = tokenList.item(i);
      if (item != null) array.push(item);
    }
    return array;
  }

  /**
   * Scroll to the element only if it is not visible.
   * Work only if scroll is manage by Body
   * return true if we scrolled
   */
  public static scrollBodyToElementIfNotVisible(element: Element): boolean {
    if (!FlHtmlHelper.isElementInViewport(element)) {
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      return true;
    }

    return false;
  }

  /**
   * Scroll to the element only if it is not visible.
   * Work is the element is in a scrollable container marked with CdkScrollable
   * return true if we scrolled
   * @param element
   */
  public static scrollElementToElementIfNotVisible(element: HTMLElement): boolean {
    const scrollableContainer = FlHtmlHelper.getAncestorScrollContainer(element);
    if (!scrollableContainer) return false;

    // check if the emoji is fully visible in the scrollable container
    const emojiRect = element.getBoundingClientRect();
    const containerRect = scrollableContainer.getBoundingClientRect();
    const emojiTop = emojiRect.top - containerRect.top;
    const emojiBottom = emojiRect.bottom - containerRect.top;

    if (emojiTop < 0 || emojiBottom > containerRect.height) {
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      return true;
    }
    return false;
  }

  /**
   * Find the nearest parent scrollable element marked with CdkScrollable
   * @param element
   */
  public static getAncestorScrollContainer(element: HTMLElement): HTMLElement | null {
    // retrieve scrollable parents
    const scrollDispatcher = FL_ROOT_INJECTOR.get(ScrollDispatcher);
    const scrollableElements = scrollDispatcher.getAncestorScrollContainers(element);

    // if there are some scrollable parent, use the first one
    if (scrollableElements.length > 0) {
      return scrollableElements[scrollableElements.length - 1].getElementRef().nativeElement;
    }
    return null;
  }

  /**
   * return true if the element is fully in the view port
   * @param element
   */
  public static isElementInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();

    /* or $(window).width() */
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * return true if the element is a child of the parent
   * @param element
   * @param parent if string, it compares with the classe
   */
  public static isChildOf(element: HTMLElement, parent: FlHtmlFindParentOptions): boolean {
    return FlHtmlHelper.getParent(element, parent) != null;
  }

  /**
   * return the parent element that satisfy the condition. If not return null
   * @param element
   * @param parent provide one of the field to search
   */
  public static getParent(element: HTMLElement, parent: FlHtmlFindParentOptions): HTMLElement | null {
    const matchesParent = FlHtmlHelper.buildParentMatcher(parent);
    let current: HTMLElement | null = element;

    while (current != null && current.tagName !== 'BODY') {
      if (matchesParent(current)) return current;
      current = current.parentElement;
    }

    return null;
  }

  /**
   * Build the predicate matching the first provided field of the options,
   * it never matches when no field is provided.
   */
  private static buildParentMatcher(parent: FlHtmlFindParentOptions): (element: HTMLElement) => boolean {
    if (parent.element) {
      const target = parent.element;
      return (element) => element === target;
    }
    if (parent.tagName) {
      const tagName = parent.tagName.toUpperCase();
      return (element) => element.tagName === tagName;
    }
    if (parent.className) {
      const className = parent.className;
      return (element) => element.classList.contains(className);
    }
    if (parent.attribute) {
      const attribute = parent.attribute;
      return (element) => FlHtmlHelper.hasAttributes(element, attribute);
    }
    return () => false;
  }

  public static hasAttributes(element: HTMLElement, attributes: Record<string, string>): boolean {
    for (const key in attributes) {
      if (element.getAttribute(key) !== attributes[key]) return false;
    }
    return true;
  }

  public static setCaretAtElementEnd(element: Node): void {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  public static setCaretAtElementPosition(element: Node, position: number): void {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.setStart(element, position);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  public static getCaretCoordinates(): { top: number; left: number } | null {
    const selection = window.getSelection();
    // rangeCount is 0 when nothing is selected, and getRangeAt would throw an IndexSizeError
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }

  public static replaceTextInNodeTextWithElement(
    node: Node,
    from: number,
    to: number,
    element: HTMLElement
  ): void {
    const textContent = node.textContent;
    const parentNode = node.parentNode;
    if (textContent == null || parentNode == null) return;

    const before = document.createTextNode(textContent.slice(0, from));
    const after = document.createTextNode(textContent.slice(to));

    node.textContent = '';
    parentNode.appendChild(before);
    parentNode.appendChild(element);
    parentNode.appendChild(after);
  }
}
