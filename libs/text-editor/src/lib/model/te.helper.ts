import {FlHtmlHelper, flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';

/**
 * Helper to complete the text editor api
 */
export class TeHelper {

  public static blockClass = 'ce-block';
  public static blockDropTargetClass = 'ce-block--drop-target';
  public static blockParagraphClass = 'ce-paragraph';
  public static blockParagraphTagName = 'DIV';

  /**
   * Extract the editor id from the editor html block element
   * @param element
   */
  public static getBlockIdFromElement(element: Element): string | null {
    return element.getAttribute('data-id');
  }

  public static getBlockIdFromElementOrChild(element: HTMLElement): string | null {
    const blockElement = FlHtmlHelper.getParent(element, {className: TeHelper.blockClass});
    if (blockElement == null) return null;
    return TeHelper.getBlockIdFromElement(element);
  }

  public static getBlockElementFromElementOrChild(element: HTMLElement): HTMLElement | null {
    return FlHtmlHelper.getParent(element, {className: TeHelper.blockClass});
  }

  /**
   * Get the block if of the ce-block--drop-target block if it exists (useful for drag and drop)
   * @param editorHtml
   */
  public static getBlockDropTargetId(editorHtml: HTMLElement): string | null {
    const blockTarget = TeHelper.getBlockTargetElement(editorHtml);
    if (blockTarget == null) return null;
    return TeHelper.getBlockIdFromElement(blockTarget);
  }

  public static getBlockTargetElement(editorHtml: HTMLElement): HTMLElement | null {
    return editorHtml.querySelector(`.${TeHelper.blockDropTargetClass}`);
  }

  /**
   * Generate a material icon element
   * @param icon
   */
  public static getMatIconElement(icon: string): string {
    return `<span class="material-icons-outlined">${icon}</span>`;
  }

  public static getTranslateService(): FlTranslateService {
    return flRootInjector.get(FlTranslateService);
  }

  /**
   * Generate a tune button with style to be used in tune menu
   */
  public static generateTuneButton(title: string, icon: string): HTMLElement {
    const button = document.createElement('div');
    button.classList.add('ce-popover-item');
    button.innerHTML = `<div class="ce-popover-item__icon">${TeHelper.getMatIconElement(icon)}</div><div class="ce-popover-item__title">${title}</div>`;
    return button;
  }

  public static extractTextFromDocumentFragment(fragment: DocumentFragment): string {
    let text = '';

    const children: HTMLElement[] = Array.from(fragment.childNodes) as any;
    children.forEach(node => {
      if (node.innerText) {
        text += node.innerText;
      }else if(node.textContent){
        text += node.textContent;
      }
    });
    return text;
  }

}
