import { SanitizerConfig } from '@editorjs/editorjs';
import { FL_ROOT_INJECTOR } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TeHelper } from '../model/te.helper';
import { TE_VARIABLE_TAG_NAME,TeVariableFormInfo } from '../model/te-variable.class';
import { TeComponentInlineTool } from './te-component-inline-tool.class';

export class TeVariableInlineToolClass extends TeComponentInlineTool<TeVariableFormInfo> {
  static override get title(): string {
    return FL_ROOT_INJECTOR.get(FlTranslateService).translate('teTextEditor.variable');
  }

  public static get sanitize(): SanitizerConfig {
    return {
      [TE_VARIABLE_TAG_NAME]: {
        'data-jsondata': true,
      },
    } as SanitizerConfig;
  }

  getInlineElementTag(): string {
    return TE_VARIABLE_TAG_NAME;
  }

  renderInlineButton(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(this.options.api.styles.inlineToolButton, 'g-text-editor-inline-button');
    button.innerHTML = '(x)';

    // hide the button if the context is not a paragraph
    if (!this.selectionIsInParagraph()) {
      button.style.display = 'none';
    }
    this.inlineButton = button;
    return button;
  }

  getDefaultData(range: Range): TeVariableFormInfo {
    // use to retrieve the text of the selected range
    const fragment = range.extractContents();
    const selectText = TeHelper.extractTextFromDocumentFragment(fragment);

    return {
      name: selectText,
      description: '',
      type: 'string',
      value: null,
    };
  }

  getWrapper(): HTMLElement | undefined {
    // only allow the variable in a paragraph
    if (!this.selectionIsInParagraph()) return undefined;
    return document.createElement(TE_VARIABLE_TAG_NAME);
  }

  private selectionIsInParagraph(): boolean {
    const parent = this.options.api.selection.findParentTag(
      TeHelper.blockParagraphTagName,
      TeHelper.blockParagraphClass
    );
    return parent != null;
  }
}
