import { InlineTool } from '@editorjs/editorjs';

/**
 * Fake inline tool that do ot render a button in the toolbar
 * It is useful so the toolbar can be showed even if there is no inline tool
 * So the convert to block can be showed
 */
export class TeFakeInlineTool implements InlineTool {
  public static isInline = true;

  public render(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'none';
    return div;
  }

  public surround(): void {}

  public checkState(): boolean {
    return false;
  }
}
