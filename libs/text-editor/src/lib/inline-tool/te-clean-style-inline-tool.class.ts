import {InlineTool, SanitizerConfig} from '@editorjs/editorjs';
import {InlineToolConstructorOptions} from '@editorjs/editorjs/types/tools/inline-tool';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {TeHelper} from '../model/te.helper';


export class TeCleanStyleInlineTool implements InlineTool {

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  static get title(): string {
    return flRootInjector.get(FlTranslateService).translate('teTextEditor.clean_style');
  }

  constructor(protected options: InlineToolConstructorOptions) {
  }

  /**
   * Sanitizer Rule
   * Leave <u> tags
   *
   * @returns {object}
   */
  public static get sanitize(): SanitizerConfig {
    return {
    };
  }


  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(this.options.api.styles.inlineToolButton, 'g-text-editor-inline-button');
    button.innerHTML = TeHelper.getMatIconElement('format_clear')
    return button;
  }

  /**
   * Clean the style of the selected text
   */
  public surround(range: Range): void {
    // replace the range select with a simple text node
    const textNode = document.createTextNode(range.toString());
    range.deleteContents();
    range.insertNode(textNode);

  }

  /**
   * Check selection and set activated state to button if there are <u> tag
   *
   * @returns {boolean}
   */
  public checkState(): boolean {
    return false;
  }

}
