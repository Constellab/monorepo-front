import { InlineTool, InlineToolConstructorOptions } from '@editorjs/editorjs/types/tools/inline-tool';

import { TeElementInlineDirective } from '../model/te-element.directive';

/**
 * Custom abstract class for editor js inline tool to support angular component
 * The component must be a custom element because on the init of the editor js, this class is not called, it is pure HTML
 *
 */
export abstract class TeComponentInlineTool<T> implements InlineTool {
  protected element: HTMLElement;

  protected inlineButton: HTMLElement;

  constructor(protected options: InlineToolConstructorOptions) {}

  static get title(): string {
    return null;
  }

  static get isInline(): boolean {
    return true;
  }

  abstract getDefaultData(range: Range): T;

  abstract getInlineElementTag(): string;

  /**
   * The button that is created when the user selects a text
   * If undefined, this tool is not available
   */
  abstract renderInlineButton(): HTMLElement | undefined;

  render(): HTMLElement {
    return this.renderInlineButton();
  }

  abstract getWrapper(): HTMLElement | undefined;

  checkState(): boolean {
    const termTag = this.getSelectionInlineElement();

    const isVariable = !!termTag;
    this.inlineButton.classList.toggle(this.options.api.styles.inlineToolButtonActive, isVariable);
    return isVariable;
  }

  surround(range: Range): void {
    if (!range) return;

    range.cloneContents().parentNode;
    const termWrapper = this.getSelectionInlineElement();

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  wrap(range: Range): void {
    if (!range) return;
    const element = this.getWrapper();
    if (!element) return;

    this.element = element;

    const defaultData = this.getDefaultData(range);
    this.element.setAttribute(TeElementInlineDirective.dataAttribute, JSON.stringify(defaultData));
    this.element.setAttribute(TeElementInlineDirective.newElementAttribute, 'true');

    range.insertNode(this.element);
    /**
     * Expand (add) selection to highlighted block
     */
    // this.config.api.selection.expandToTag(this.variableElement);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper: HTMLElement): void {
    /**
     * Expand selection to all term-tag
     */
    this.options.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    if (sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!range) return;

    const unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Method to retrieve the inline element on the current selection  if it exists
   * @private
   */
  private getSelectionInlineElement(): HTMLElement | undefined {
    if (this.element) return this.element;
    const variableElement = this.options.api.selection.findParentTag(this.getInlineElementTag());
    if (!variableElement) return null;
    this.element = variableElement;
    return variableElement;
  }
}
