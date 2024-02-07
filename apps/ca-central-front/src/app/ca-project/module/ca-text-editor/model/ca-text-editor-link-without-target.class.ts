import {CaQuillLink} from './ca-quill-export.class';


export class CaTextEditorLink extends CaQuillLink {

  //Create the html element for the link without the target attribute
  static create(value: string): any {
    const node: HTMLElement = super.create(value) as any;
    node.removeAttribute('target');
    return node;
  }
}
