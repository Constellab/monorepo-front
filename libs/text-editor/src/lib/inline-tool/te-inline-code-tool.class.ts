import { API, InlineTool, SanitizerConfig } from '@editorjs/editorjs';

const INLINE_CODE_CSS = 'inline-code';
const TAG = 'CODE';

const ICON =
  // eslint-disable-next-line max-len
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8L5 12L9 16"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8L19 12L15 16"/></svg>';

/**
 * Custom Inline Code Tool
 *
 * Replaces @editorjs/inline-code to fix a bug where multiple inline code
 * elements could not coexist in the same block (e.g. list item).
 *
 * The original plugin's surround() used parentElement.querySelector('CODE')
 * which found ANY existing <code> tag in the parent, preventing new ones.
 * This implementation only checks if the current selection is already inside
 * a <code> tag (to toggle it off), and always allows wrapping new selections.
 */
export class TeInlineCodeTool implements InlineTool {
  public static isInline = true;
  public static title = 'InlineCode';

  public static get sanitize(): SanitizerConfig {
    return {
      code: { class: INLINE_CODE_CSS },
    } as SanitizerConfig;
  }

  private api: API;
  private button: HTMLButtonElement | null = null;
  private iconClasses: { base: string; active: string };

  constructor({ api }: { api: API }) {
    this.api = api;
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  public render(): HTMLElement {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = ICON;
    return this.button;
  }

  public surround(range: Range): void {
    if (!range) return;

    const parentCode = this.api.selection.findParentTag(TAG, INLINE_CODE_CSS);
    if (parentCode) {
      this.unwrap(parentCode);
    } else {
      this.wrap(range);
    }
  }

  public checkState(): boolean {
    const parentCode = this.api.selection.findParentTag(TAG, INLINE_CODE_CSS);
    if (this.button) {
      this.button.classList.toggle(this.iconClasses.active, !!parentCode);
    }
    return !!parentCode;
  }

  public get shortcut(): string {
    return 'CMD+SHIFT+M';
  }

  private wrap(range: Range): void {
    const codeElement = document.createElement(TAG);
    codeElement.classList.add(INLINE_CODE_CSS);
    codeElement.appendChild(range.extractContents());
    range.insertNode(codeElement);
    this.api.selection.expandToTag(codeElement);
  }

  private unwrap(codeElement: HTMLElement): void {
    this.api.selection.expandToTag(codeElement);

    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const contents = range.extractContents();
    codeElement.parentNode?.removeChild(codeElement);
    range.insertNode(contents);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}
