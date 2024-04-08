import {SanitizerConfig} from '@editorjs/editorjs';
import {TeVariableFormInfo, teVariableTagName} from '../model/te-variable.class';
import {TeHelper} from '../model/te.helper';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {TeComponentInlineTool} from './te-component-inline-tool.class';


export class TeVariableInlineToolClass extends TeComponentInlineTool<TeVariableFormInfo> {

  static override get title(): string {
    return flRootInjector.get(FlTranslateService).translate('teTextEditor.variable');
  }

  public static get sanitize(): SanitizerConfig {
    return {
      ['te-variable-inline']: {
        'data-jsondata': true,
      }
    } as SanitizerConfig;
  }

  getInlineElementTag(): string {
    return teVariableTagName;
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
      value: null
    };
  }

  getWrapper(): HTMLElement | undefined {
    // only allow the variable in a paragraph
    if (!this.selectionIsInParagraph()) return undefined;
    return document.createElement(teVariableTagName);
  }




  private selectionIsInParagraph(): boolean {
    const parent = this.options.api.selection.findParentTag(TeHelper.blockParagraphTagName,
      TeHelper.blockParagraphClass);
    return parent != null;
  }
}
