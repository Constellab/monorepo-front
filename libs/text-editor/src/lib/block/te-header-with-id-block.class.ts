import Header from '@editorjs/header';
import {ClStringHelper} from '@monorepo/core-lib';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';

/**
 * Override header block to add an id attribute based on the text
 */
export class TeHeaderWithIdBlock extends Header {

  static get toolbox(): ToolboxConfig {
    // split the toolbox config into 3 individual buttons
    const translateService = flRootInjector.get(FlTranslateService);
    return [
      {
        icon: 'H2',
        title: translateService.translate('teTextEditor.header_2'),
        data: {
          level: 2,
        },
      },
      {
        icon: 'H3',
        title: translateService.translate('teTextEditor.header_3'),
        data: {
          level: 3,
        },
      },
      {
        icon: 'H4',
        title: translateService.translate('teTextEditor.header_4'),
        data: {
          level: 4,
        },
      }
    ];
  }

  render(): HTMLElement {
    const node: HTMLElement = super.render();

    if (node.innerText.trim() == '') return node;

    const id = ClStringHelper.toKebabCase(node.innerText);
    node.setAttribute('id', id);
    return node;
  }
}
