import {InlineTool, SanitizerConfig} from '@editorjs/editorjs';
import {IconStrikethrough} from '@codexteam/icons';

export default class StrikethroughInlineTool implements InlineTool{

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Strikethrough';


  /**
   * Sanitizer Rule
   * Leave <u> tags
   *
   * @returns {object}
   */
  public static get sanitize(): SanitizerConfig {
    return {
      s: {},
    } as SanitizerConfig;
  }

  /**
   * Native Document's command that uses for Underline
   */
  private readonly commandName: string = 'strikeThrough';

  /**
   * Styles
   */
  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--strikethrough',
  };

  /**
   * Elements
   */
  private nodes: {button: HTMLButtonElement} = {
    button: undefined,
  };

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
    this.nodes.button.innerHTML = IconStrikethrough;

    return this.nodes.button;
  }

  /**
   * Wrap range with <s> tag
   */
  public surround(): void {
    document.execCommand(this.commandName);
  }

  /**
   * Check selection and set activated state to button if there are <s> tag
   *
   * @returns {boolean}
   */
  public checkState(): boolean {
    const isActive = document.queryCommandState(this.commandName);

    this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);

    return isActive;
  }

  /**
   * Set a shortcut
   *
   * @returns {boolean}
   */
  public get shortcut(): string {
    return 'CMD+D';
  }

}
