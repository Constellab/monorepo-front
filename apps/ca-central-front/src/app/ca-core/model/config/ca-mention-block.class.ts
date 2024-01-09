import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {FlOverlayRef, FlPortalConfig, FlPortalService, flRootInjector} from '@monorepo/front-core-lib';
import {
  CaUserMentionPortalComponent,
  CaUserMentionPortalInput,
  CaUserMentionPortalResult
} from '../../entity-module/ca-user-core/component/ca-user-mention-portal/ca-user-mention-portal.component';
import {CaUser} from '../entities/ca-user.class';
import {Observable} from 'rxjs';
import {ClRichTextMentionBlockData} from '@monorepo/core-lib';

// copy from the editorjs tutorial
export class MarkerTool {

  api: any;
  button: any;
  _state: any;
  tag: any;
  class: any;
  colorPicker: any;

  static get isInline() {
    return true;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({api}: any) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = 'MARK';
    this.class = 'cdx-marker';
    console.log('AAAAAAA')
  }

  render(): any {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range: any): any {
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  }

  wrap(range: any): any {
    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);

    mark.classList.add(this.class);
    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
  }

  unwrap(range: any): any {
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    const text = range.extractContents();

    mark.remove();

    range.insertNode(text);
  }


  checkState(): any {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;

    if (this.state) {
      this.showActions(mark);
    } else {
      this.hideActions();
    }
  }

  renderActions(): any {
    this.colorPicker = document.createElement('input');
    this.colorPicker.type = 'color';
    this.colorPicker.value = '#f5f1cc';
    this.colorPicker.hidden = true;

    return this.colorPicker;
  }

  showActions(mark: any): any {
    const {backgroundColor} = mark.style;
    this.colorPicker.value = backgroundColor ? this.convertToHex(backgroundColor) : '#f5f1cc';

    this.colorPicker.onchange = () => {
      mark.style.backgroundColor = this.colorPicker.value;
    };
    this.colorPicker.hidden = false;
  }

  hideActions(): any {
    this.colorPicker.onchange = null;
    this.colorPicker.hidden = true;
  }

  convertToHex(color: any): any {
    const rgb = color.match(/(\d+)/g);

    let hexr = parseInt(rgb[0]).toString(16);
    let hexg = parseInt(rgb[1]).toString(16);
    let hexb = parseInt(rgb[2]).toString(16);

    hexr = hexr.length === 1 ? '0' + hexr : hexr;
    hexg = hexg.length === 1 ? '0' + hexg : hexg;
    hexb = hexb.length === 1 ? '0' + hexb : hexb;

    return '#' + hexr + hexg + hexb;
  }

  static get shortcut(): string {
    console.log('BBBBBB');
    return '@';
  }
}

export class CaMentionBlock implements BlockTool {

  private static readonly MENTION_CHAR = '@';

  private node: HTMLElement;

  private portalOverlay: FlOverlayRef;


  constructor(private options: BlockToolConstructorOptions,
              private users$?: Observable<CaUser[]>) {
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get isInline(): boolean {
    return true;
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon(): any {
    return `<span class="material-icons-outlined">person</span>`;
  }

  render(): HTMLElement {
    // this.node = super.render();
    this.node = document.createElement('div');
    this.node.classList.add('ctx-block');
    this.node.classList.add('ce-paragraph');
    this.node.setAttribute('contenteditable', this.options.readOnly ? 'false' : 'true');
    this.node.dataset.placeholder = this.options.config.placeholder;

    // convert the data to HTML
    const data: ClRichTextMentionBlockData = this.options.data;
    if (data?.elements?.length > 0) {
      for (const element of data.elements) {
        if (element.type == 'text') {
          // interpret &nbsp; as a space
          const text = element.text.replace(/&nbsp;/g, ' ');
          const textNode = document.createTextNode(text);
          this.node.appendChild(textNode);
        } else {
          const span = this.createSpanMention(element.userId, element.fullname);
          this.node.appendChild(span);
        }
      }
    }

    // add a listener for @ character
    this.node.addEventListener('keydown', (event: KeyboardEvent) => {
      this.handleKeyboardEvent(event);
    });

    return this.node;
  }


  private handleKeyboardEvent(event: KeyboardEvent): void {
    if (!window) return;

    if (event.key == CaMentionBlock.MENTION_CHAR) {
      // use a setTimeout to let the caret position be updated
      setTimeout(() => this.openMentionPortal(), 0);
    }
  }

  private openMentionPortal(): void {
    if (this.portalIsOpen() || !this.users$) return;

    const caretInfo = this.getCaretInfo();
    if (caretInfo == null) return;


    const data: CaUserMentionPortalInput = {
      users$: this.users$,
      nodeBlock: this.node,
      textNode: caretInfo.container as Text,
      initialCaretPosition: caretInfo.caretPosition,
    };

    const portalService = flRootInjector.get(FlPortalService);

    const config: FlPortalConfig = portalService.configureAbsolutePortal({
      top: caretInfo.y + 20 + 'px',
      left: caretInfo.x + 'px',
    }, {
      // disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });
    this.portalOverlay = portalService.createPortal(CaUserMentionPortalComponent, config, data);

    this.portalOverlay.detachments().subscribe(
      result => this.onPortalClosed(result)
    );
  }

  private onPortalClosed(portalResult?: CaUserMentionPortalResult): void {
    this.portalOverlay = null;
    if (!portalResult) return;

    // first remove the characters corresponding to the search input
    const text = portalResult.textNode.wholeText;
    const texts = text.split(CaMentionBlock.MENTION_CHAR + portalResult.searchInput);

    // create 3 nodes: the span, the text after the span and the text before the span and add them to the DOM
    const span = this.createSpanMention(portalResult.userId, portalResult.userFullname);
    const afterNode = document.createTextNode(texts.length > 1 ? texts[1] : '');
    const beforeNode = document.createTextNode(texts[0]);

    const textNode = portalResult.textNode.parentNode === this.node ? portalResult.textNode : portalResult.textNode.nextSibling;
    // replace this.atContainer with the new nodes
    this.node.replaceChild(afterNode, textNode);
    this.node.insertBefore(span, afterNode);
    this.node.insertBefore(beforeNode, span);

    // set the caret on the start of the afterNode
    const range = document.createRange();
    range.setStart(afterNode, 0);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private createSpanMention(userId: string, userFullname: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = '@' + userFullname;
    span.setAttribute('data-user-id', userId);
    span.classList.add('g-ca-mention');
    span.setAttribute('contenteditable', 'false');
    return span;
  }

  private getCaretInfo(): { x: number, y: number, container: Node, caretPosition: number } {
    // Get the current selection
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      // Get the first range in the selection
      const range = selection.getRangeAt(0);

      // Get the list of client rectangles for the caret position
      const rects = range.getClientRects();

      if (rects.length > 0) {
        // Get the first rectangle, which represents the caret position
        const caretRect = rects[0];

        // Calculate absolute coordinates relative to the document
        return {
          x: caretRect.left + window.scrollX,
          y: caretRect.top + window.scrollY,
          container: range.startContainer,
          caretPosition: range.startOffset
        };
      }
    }
    return null;
  }


  private portalIsOpen(): boolean {
    return this.portalOverlay != null;
  }

  validate(blockData: ClRichTextMentionBlockData): boolean {
    return blockData?.elements?.length > 0;
  }

  save(block: HTMLElement): ClRichTextMentionBlockData {

    const blockData: ClRichTextMentionBlockData = {
      elements: []
    };

    // loop through the block children
    for (let i = 0; i < block.childNodes.length; i++) {
      const child = block.childNodes[i];
      if (child.nodeType == Node.TEXT_NODE) {
        blockData.elements.push({
          type: 'text',
          text: child.textContent
        });
      } else {
        const userId = (child as HTMLElement).getAttribute('data-user-id');
        blockData.elements.push({
          type: 'mention',
          userId: userId,
          fullname: child.textContent.replace('@', '')
        });
      }
    }

    return blockData;
  }

  destroy(): void {
    if (this.portalOverlay) {
      this.portalOverlay.dispose();
    }
  }

  public test(): void {
    console.log('AAAAAAAAAAAAAAAAAA');
  }
}
