import {
  InlineTool,
  InlineToolConstructable,
  InlineToolConstructorOptions
} from '@editorjs/editorjs/types/tools/inline-tool';
import {SanitizerConfig} from '@editorjs/editorjs';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {teVariableAttribute, TeVariableFormInfo, teVariableTagName} from '../model/te-variable.class';
import {TeHelper} from '../model/te.helper';


export class TeVariableInlineToolClass implements InlineTool {

  inlineButton: HTMLElement;

  private variableElement: HTMLElement;

  constructor(private config: InlineToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef) {
  }

  static get isInline(): boolean {
    return true;
  }

  public static get sanitize(): SanitizerConfig {
    return {
      ['te-variable-inline']: {
        'data-jsondata': true,
        class: true,

      }
    } as SanitizerConfig;
  }


  checkState(): boolean {
    const termTag = this.config.api.selection.findParentTag(teVariableTagName);

    const isVariable = !!termTag;
    this.inlineButton.classList.toggle(this.config.api.styles.inlineToolButtonActive, isVariable);
    return isVariable;
  }

  render(): HTMLElement {
    // only allow the variable in a paragraph
    if(!this.selectionIsInParagraph()) return undefined;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(this.config.api.styles.inlineToolButton, 'g-text-editor-inline-button');
    button.innerHTML = 'X';

    this.inlineButton = button;
    return button;
  }

  surround(range: Range): void {
    range.cloneContents().parentNode
    const termWrapper = this.getVariableElement();

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
    // only allow the variable in a paragraph
    if(!this.selectionIsInParagraph()) return;

    // use to retrieve the text of the selected range
    const fragment = range.extractContents();
    const selectText = TeHelper.extractTextFromDocumentFragment(fragment);

    this.variableElement = document.createElement(teVariableTagName);

    const defaultInfo: TeVariableFormInfo = {
      name: selectText,
      description: '',
      type: 'string',
      value: null
    };
    this.variableElement.setAttribute(teVariableAttribute, JSON.stringify(defaultInfo));

    range.insertNode(this.variableElement);
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
    this.config.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

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

  private getVariableElement(): HTMLElement {
    if (this.variableElement) return this.variableElement;
    const variableElement = this.config.api.selection.findParentTag(teVariableTagName);
    if (!variableElement) return null;
    this.variableElement = variableElement;
    return variableElement;
  }

  private selectionIsInParagraph(): boolean {
    const parent = this.config.api.selection.findParentTag(TeHelper.blockParagraphTagName,
      TeHelper.blockParagraphClass);
    return parent != null;
  }

}

/**
 * Factory function to create a block tool constructor for editor js configuration
 * This allow to pass environment injector, application ref and additional data to block constructor
 * @param blockType
 * @param environmentInjector
 * @param applicationRef
 * @param additionalData
 */
export function teInlineToolFactory(
  blockType: any,
  environmentInjector: EnvironmentInjector,
  applicationRef: ApplicationRef,
  additionalData?: any): any {


  // this class implement the BlockToolConstructable interface (but because of constructor it is not recognized as such)
  return class TeClass {
    static isInline = (blockType as InlineToolConstructable).isInline;
    static title = (blockType as InlineToolConstructable).title;
    static sanitize = (blockType as InlineToolConstructable).sanitize;

    constructor(config: InlineToolConstructorOptions) {
      return new blockType(config, environmentInjector, applicationRef, additionalData) as any;
    }
  };
}

