import { BlockToolData } from '@editorjs/editorjs';
import { BlockTool } from '@editorjs/editorjs/types/tools/block-tool';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { TeHelper } from '@monorepo/text-editor';

/**
 * Formula block for editor js
 */
export class DcTextEditorToolExampleBlock implements BlockTool {
  static get toolbox(): ToolboxConfig {
    return {
      title: 'Example Tool',
      icon: TeHelper.getMatIconElement('home'),
    };
  }

  /**
   * Render a div with a <p> with an example text
   */
  render(): Promise<HTMLElement> | HTMLElement {
    const wrapper = document.createElement('div');
    const p = document.createElement('p');
    p.innerText = 'This is an example tool block';
    wrapper.appendChild(p);
    return wrapper;
  }

  save(): BlockToolData {
    return {};
  }
}
