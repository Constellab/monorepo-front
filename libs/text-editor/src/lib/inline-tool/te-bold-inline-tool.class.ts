import { InlineTool, SanitizerConfig } from '@editorjs/editorjs';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { IconBold } from '@codexteam/icons';

/**
 * Bold Tool
 *
 * Inline Toolbar Tool
 *
 * Makes selected text bolder
 *
 * Code from
 * https://github.com/codex-team/editor.js/blob/next/src/components/inline-tools/inline-tool-bold.ts#L32
 *
 * This was overided to support strong tag
 */
export class TeBoldInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Bold';

  /**
   * Sanitizer Rule
   * Leave <b> tags
   *
   * @returns {object}
   */
  public static get sanitize(): SanitizerConfig {
    return {
      b: {},
      strong: {},
    } as SanitizerConfig;
  }

  /**
   * Native Document's command that uses for Bold
   */
  private readonly commandName: string = 'bold';

  /**
   * Create button for Inline Toolbar
   */
  public render(): MenuConfig {
    return {
      icon: IconBold,
      name: 'bold',
      onActivate: () => {
        document.execCommand(this.commandName);
      },
      isActive: () => document.queryCommandState(this.commandName),
    };
  }

  /**
   * Set a shortcut
   *
   * @returns {boolean}
   */
  public get shortcut(): string {
    return 'CMD+B';
  }
}
