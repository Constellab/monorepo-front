import {
  InlineTool,
  InlineToolConstructable,
  InlineToolConstructorOptions
} from '@editorjs/editorjs/types/tools/inline-tool';
import {API, SanitizerConfig} from '@editorjs/editorjs';
import {ApplicationRef, ComponentRef, createComponent, EnvironmentInjector} from '@angular/core';
import {
  TeVariableFormComponent,
  TeVariableFormInfo,
  TeVariableFormType
} from '../component/te-variable-form/te-variable-form.component';
import {FormBuilder} from '@angular/forms';
import {Subscription} from 'rxjs';
import {I18n, InlineToolbar, Notifier, Selection, Toolbar} from '@editorjs/editorjs/types/api';


export class TeVariableInlineToolClass implements InlineTool {
  static id = 0;

  shortcut: string;

  inlineButton: HTMLElement;

  private readonly tag = 'SPAN';
  private readonly className = 'g-text-editor-variable';
  // attribute of the span element that is used to store the json data
  private readonly jsonAttribute = 'data-jsondata';

  private span: HTMLElement;

  private inlineToolbarComponentRef: ComponentRef<TeVariableFormComponent>;
  private formGroupSubscription: Subscription;

  id = TeVariableInlineToolClass.id++;


  constructor(private config: InlineToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef) {
    // console.log('NEw inline tooool');

    const a = this.config.api.selection.findParentTag('DIV', 'codex-editor__redactor');
    console.log('NEw inline tooool', a);
  }

  static get isInline(): boolean {
    return true;
  }

  public static get sanitize(): SanitizerConfig {
    return {
      span: {
        contenteditable: true,
        'data-jsondata': true,
        class: true,
      }
    } as SanitizerConfig;
  }


  checkState(): boolean {
    return false;
    const termTag = this.config.api.selection.findParentTag(this.tag, this.className);

    const isVariable = !!termTag;

    this.inlineButton.classList.toggle(this.config.api.styles.inlineToolButtonActive, isVariable);
    console.log('checkState', isVariable);
    return isVariable;
  }

  render(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(this.config.api.styles.inlineToolButton, 'g-text-editor-inline-button');
    button.innerHTML = 'X';

    this.inlineButton = button;
    return button;
  }

  surround(range: Range): void {
    const termWrapper = this.getSpanElement();

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
    /**
     * Create a wrapper for highlighting
     */
    this.span = document.createElement(this.tag);

    this.span.classList.add(this.className);
    this.span.contentEditable = 'false';

    const defaultInfo: TeVariableFormInfo = {
      name: this.span.innerText,
      description: '',
      type: 'string',
      value: null
    };
    this.setVariableInfo(defaultInfo, this.span);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    this.span.appendChild(range.extractContents());
    range.insertNode(this.span);

    /**
     * Expand (add) selection to highlighted block
     */
    this.config.api.selection.expandToTag(this.span);
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

  renderActions(): HTMLElement {
    console.log('renderActions', this.id);
    // if (!this.checkState()) return undefined;
    const formGroup = new FormBuilder().group({
      name: '',
      description: '',
      type: 'string' as TeVariableFormType,
      value: null as string
    });
    formGroup.patchValue(this.getVariableInfo());

    // update the json data when the form group changes
    this.formGroupSubscription = formGroup.valueChanges.subscribe(
      (value) => this.setVariableInfo(value)
    );

    // create the inline toolbar component
    const htmlElement = document.createElement('te-variable-form');
    htmlElement.classList.add('g-te-block');
    this.inlineToolbarComponentRef = createComponent(TeVariableFormComponent, {
      environmentInjector: this.envInjector,
      hostElement: htmlElement,
    });
    this.inlineToolbarComponentRef.instance.formGroup = formGroup;

    this.applicationRef.attachView(this.inlineToolbarComponentRef.hostView);
    return htmlElement;
  }

  clear(): void {
    if (this.inlineToolbarComponentRef) {
      this.inlineToolbarComponentRef.destroy();
      this.inlineToolbarComponentRef = null;
    }
    if (this.formGroupSubscription) {
      this.formGroupSubscription.unsubscribe();
      this.formGroupSubscription = null;
    }
  }


  getVariableInfo(): TeVariableFormInfo {
    const span = this.getSpanElement();
    if (!span) return null;

    const jsonAttribute = span.getAttribute(this.jsonAttribute);
    if (!jsonAttribute) return null;

    return JSON.parse(jsonAttribute);
  }

  setVariableInfo(info: TeVariableFormInfo, span?: HTMLElement): void {
    if (!span) {
      span = this.getSpanElement();
    }
    if (!span) return;

    span.setAttribute(this.jsonAttribute, JSON.stringify(info));
  }

  private getSpanElement(): HTMLElement {
    if (this.span) return this.span;
    const span = this.config.api.selection.findParentTag(this.tag, this.className);
    if (!span) return null;
    this.span = span;
    return span;
  }


  // static get shortcut(): string {
  //   console.log('BBBBBB');
  //   return 'ctrl+shift+a';
  // }

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


/**
 * Link Tool
 *
 * Inline Toolbar Tool
 *
 * Wrap selected text with <a> tag
 */
export default class LinkInlineTool22 implements InlineTool {

  // select: SelectionUtils;
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Link';

  /**
   * Sanitizer Rule
   * Leave <a> tags
   *
   * @returns {object}
   */
  public static get sanitize(): SanitizerConfig {
    return {
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow',
      },
    } as SanitizerConfig;
  }

  /**
   * Native Document's commands for link/unlink
   */
  private readonly commandLink: string = 'createLink';
  private readonly commandUnlink: string = 'unlink';

  /**
   * Enter key code
   */
  private readonly ENTER_KEY: number = 13;

  /**
   * Styles
   */
  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--link',
    buttonUnlink: 'ce-inline-tool--unlink',
    input: 'ce-inline-tool-input',
    inputShowed: 'ce-inline-tool-input--showed',
  };

  /**
   * Elements
   */
  private nodes: {
    button: HTMLButtonElement;
    input: HTMLInputElement;
  } = {
    button: null,
    input: null,
  };

  /**
   * Input opening state
   */
  private inputOpened = false;

  /**
   * Available Toolbar methods (open/close)
   */
  private toolbar: Toolbar;

  /**
   * Available inline toolbar methods (open/close)
   */
  private inlineToolbar: InlineToolbar;

  /**
   * Notifier API methods
   */
  private notifier: Notifier;

  /**
   * I18n API
   */
  private i18n: I18n;

  private selection: Selection;

  /**
   * @param api - Editor.js API
   */
  constructor({api}: { api: API }) {
    this.toolbar = api.toolbar;
    this.inlineToolbar = api.inlineToolbar;
    this.notifier = api.notifier;
    this.i18n = api.i18n;
    this.selection = api.selection;
  }

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);

    this.nodes.button.innerHTML = 'A';

    return this.nodes.button;
  }

  /**
   * Input for the link
   */
  public renderActions(): HTMLElement {
    console.log('renderActions');
    this.nodes.input = document.createElement('input') as HTMLInputElement;
    this.nodes.input.placeholder = this.i18n.t('Add a link');
    this.nodes.input.classList.add(this.CSS.input);
    this.nodes.input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === this.ENTER_KEY) {
        this.enterPressed(event);
      }
    });

    return this.nodes.input;
  }

  /**
   * Handle clicks on the Inline Toolbar icon
   *
   * @param {Range} range - range to wrap with link
   */
  public surround(range: Range): void {
    /**
     * Range will be null when user makes second click on the 'link icon' to close opened input
     */
    if (range) {
      /**
       * Save selection before change focus to the input
       */
      if (!this.inputOpened) {
        /** Create blue background instead of selection */
        // this.api.selection.setFakeBackground();
        // this.selection.save();
      } else {
        // this.selection.restore();
        // this.selection.removeFakeBackground();
      }
      const parentAnchor = this.selection.findParentTag('A');

      /**
       * Unlink icon pressed
       */
      if (parentAnchor) {
        this.selection.expandToTag(parentAnchor);
        this.unlink();
        this.closeActions();
        this.checkState();
        this.toolbar.close();

        return;
      }
    }

    this.toggleActions();
  }

  /**
   * Check selection and set activated state to button if there are <a> tag
   */
  public checkState(): boolean {
    const anchorTag = this.selection.findParentTag('A');

    if (anchorTag) {
      this.nodes.button.innerHTML = 'A';
      this.nodes.button.classList.add(this.CSS.buttonUnlink);
      this.nodes.button.classList.add(this.CSS.buttonActive);
      this.openActions();

      /**
       * Fill input value with link href
       */
      const hrefAttr = anchorTag.getAttribute('href');

      this.nodes.input.value = hrefAttr !== 'null' ? hrefAttr : '';

      // this.selection.save();
    } else {
      this.nodes.button.innerHTML = 'A';
      this.nodes.button.classList.remove(this.CSS.buttonUnlink);
      this.nodes.button.classList.remove(this.CSS.buttonActive);
    }

    return !!anchorTag;
  }

  /**
   * Function called with Inline Toolbar closing
   */
  public clear(): void {
    this.closeActions();
  }

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CMD+K';
  }

  /**
   * Show/close link input
   */
  private toggleActions(): void {
    if (!this.inputOpened) {
      this.openActions(true);
    } else {
      this.closeActions(false);
    }
  }

  /**
   * @param {boolean} needFocus - on link creation we need to focus input. On editing - nope.
   */
  private openActions(needFocus = false): void {
    this.nodes.input.classList.add(this.CSS.inputShowed);
    if (needFocus) {
      this.nodes.input.focus();
    }
    this.inputOpened = true;
  }

  /**
   * Close input
   *
   * @param {boolean} clearSavedSelection — we don't need to clear saved selection
   *                                        on toggle-clicks on the icon of opened Toolbar
   */
  private closeActions(clearSavedSelection = true): void {
    // if (this.selection.isFakeBackgroundEnabled) {
    //   // if actions is broken by other selection We need to save new selection
    //   const currentSelection = new SelectionUtils();
    //
    //   currentSelection.save();
    //
    //   this.selection.restore();
    //   this.selection.removeFakeBackground();
    //
    //   // and recover new selection after removing fake background
    //   currentSelection.restore();
    // }
    //
    // this.nodes.input.classList.remove(this.CSS.inputShowed);
    // this.nodes.input.value = '';
    // if (clearSavedSelection) {
    //   this.selection.clearSaved();
    // }
    // this.inputOpened = false;
  }

  /**
   * Enter pressed on input
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  private enterPressed(event: KeyboardEvent): void {
    let value = this.nodes.input.value || '';

    if (!value.trim()) {
      this.unlink();
      event.preventDefault();
      this.closeActions();

      return;
    }

    if (!this.validateURL(value)) {
      this.notifier.show({
        message: 'Pasted link is not valid.',
        style: 'error',
      });

      // _.log('Incorrect Link pasted', 'warn', value);

      return;
    }

    value = this.prepareLink(value);


    this.insertLink(value);

    /**
     * Preventing events that will be able to happen
     */
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.inlineToolbar.close();
  }

  /**
   * Detects if passed string is URL
   *
   * @param {string} str - string to validate
   * @returns {boolean}
   */
  private validateURL(str: string): boolean {
    /**
     * Don't allow spaces
     */
    return !/\s/.test(str);
  }

  /**
   * Process link before injection
   * - sanitize
   * - add protocol for links like 'google.com'
   *
   * @param {string} link - raw user input
   */
  private prepareLink(link: string): string {
    link = link.trim();
    link = this.addProtocol(link);

    return link;
  }

  /**
   * Add 'http' protocol to the links like 'vc.ru', 'google.com'
   *
   * @param {string} link - string to process
   */
  private addProtocol(link: string): string {
    /**
     * If protocol already exists, do nothing
     */
    if (/^(\w+):(\/\/)?/.test(link)) {
      return link;
    }

    /**
     * We need to add missed HTTP protocol to the link, but skip 2 cases:
     *     1) Internal links like "/general"
     *     2) Anchors looks like "#results"
     *     3) Protocol-relative URLs like "//google.com"
     */
    const isInternal = /^\/[^/\s]/.test(link),
      isAnchor = link.substring(0, 1) === '#',
      isProtocolRelative = /^\/\/[^/\s]/.test(link);

    if (!isInternal && !isAnchor && !isProtocolRelative) {
      link = 'http://' + link;
    }

    return link;
  }

  /**
   * Inserts <a> tag with "href"
   *
   * @param {string} link - "href" value
   */
  private insertLink(link: string): void {
    /**
     * Edit all link, not selected part
     */
    const anchorTag = this.selection.findParentTag('A');

    if (anchorTag) {
      this.selection.expandToTag(anchorTag);
    }

    document.execCommand(this.commandLink, false, link);
  }

  /**
   * Removes <a> tag
   */
  private unlink(): void {
    document.execCommand(this.commandUnlink);
  }
}
