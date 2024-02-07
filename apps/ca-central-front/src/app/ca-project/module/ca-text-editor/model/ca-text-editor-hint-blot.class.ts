import {CaQuillBlock} from './ca-quill-export.class';

export type CaTextEditorHintType = 'info' | 'warning' | 'science';


export class CaTextEditorHintBlot extends CaQuillBlock {

  static blotName = 'hint';
  static tagName = 'DIV';
  static className = 'g-text-editor-hint';

  static create(value: CaTextEditorHintType): any {
    const node: HTMLElement = super.create(value) as any;
    node.classList.add(`g-text-editor-hint-${value}`);
    return node;
  }

  static formats(domNode: HTMLElement): CaTextEditorHintType {
    return domNode.classList.contains('g-text-editor-hint-warning') ? 'warning' :
      domNode.classList.contains('g-text-editor-hint-science') ? 'science' :
        'info';
  }

}
