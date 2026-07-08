import { SanitizerConfig } from '@editorjs/editorjs';
import { FL_ROOT_INJECTOR } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TeFormulaInlineToolData } from '../component/te-formula-inline/te-formula-inline.component';
import { TeHelper } from '../model/te.helper';
import { TeComponentInlineTool } from './te-component-inline-tool.class';

export class TeFormulaInlineToolClass extends TeComponentInlineTool<TeFormulaInlineToolData> {
  public static TAG = 'te-formula-inline';

  static override get title(): string {
    return FL_ROOT_INJECTOR.get(FlTranslateService).translate('teTextEditor.formula');
  }

  public static get sanitize(): SanitizerConfig {
    return {
      [TeFormulaInlineToolClass.TAG]: {
        'data-jsondata': true,
      },
    } as SanitizerConfig;
  }

  getInlineElementTag(): string {
    return TeFormulaInlineToolClass.TAG;
  }

  renderInlineButton(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(this.options.api.styles.inlineToolButton, 'g-text-editor-inline-button');
    button.innerHTML = TeHelper.getMatIconElement('functions');

    // hide the button if the context is not a paragraph
    // if (!this.selectionIsInParagraph()) {
    //   button.style.display = 'none';
    // }
    this.inlineButton = button;
    return button;
  }

  getDefaultData(range: Range): TeFormulaInlineToolData {
    // use to retrieve the text of the selected range
    const fragment = range.extractContents();
    const selectText = TeHelper.extractTextFromDocumentFragment(fragment);

    return {
      formula: selectText,
    };
  }

  getWrapper(): HTMLElement | undefined {
    return document.createElement(TeFormulaInlineToolClass.TAG);
  }
}
