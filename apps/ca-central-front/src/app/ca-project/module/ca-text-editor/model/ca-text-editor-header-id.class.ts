import {ClStringHelper} from '@monorepo/core-lib';
import {CaQuillHeader} from './ca-quill-export.class';

export interface CaRichTextHeader {
  level: number;
  id: string;
}

export class CaTextEditorHeaderId extends CaQuillHeader {

  //Create the html element for a title with an attribute id
  static create(value: number | string | CaRichTextHeader): any {
    if (typeof value === 'number' || typeof value === 'string') {
      return super.create(value);
    } else {
      const node: HTMLElement = super.create(value.level) as any;
      if (value.id && value.id.length > 0) {
        node.setAttribute('id', value.id);
      } else {
        node.setAttribute('id', ClStringHelper.generateUUID());
      }
      return node;
    }
  }

  //Format the title values as a rich text header
  static formats(domNode: HTMLElement): CaRichTextHeader {
    const result = super.formats(domNode);
    if(domNode.innerText.trim() == '') return null;
    const id = ClStringHelper.toKebabCase(domNode.innerText);
    //Set idea before the first reload
    if (!domNode.id) {
      domNode.id = id;
    }

    return {
      level: result,
      id: id
    };
  }

  format(name: string, value: any): void {
    super.format(name, value);
  }
}
