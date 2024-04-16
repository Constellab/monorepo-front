import {Injectable, OnDestroy} from '@angular/core';
import Quill, {RangeStatic} from 'quill';
import {CaTextEditorUploadedImage} from '../model/ca-text-editor-image.class';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CaTextEditorConfig} from '../model/ca-text-editor-config.class';
import {ClRichTextFigure} from '@monorepo/core-lib';

@Injectable()
export class CaTextEditorState implements OnDestroy {

  public textEditorContainer: HTMLElement;

  public quill: Quill;

  private disabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private outsideClick$: Subject<MouseEvent> = new Subject();

  public config: CaTextEditorConfig;

  public init(quill: Quill, config: CaTextEditorConfig, textEditorContainer: HTMLElement, disabled: boolean): void {
    this.quill = quill;
    this.config = config;
    this.textEditorContainer = textEditorContainer;
    this.disabled$.next(disabled);
  }


  public insertImageFromUrl(image: CaTextEditorUploadedImage, index: number): any {
    const figure: ClRichTextFigure = {
      filename: image.filename,
      width: image.width,
      height: image.height,
      naturalWidth: image.width,
      naturalHeight: image.height
    };
    return this.insertEmbed(index, 'figure', figure);
  }

  public createLink(index: number, link: string, linkName: string): any {
    return {
      ops: [
        {
          attributes: {
            link: link
          },
          insert: linkName
        }
      ]
    };
  }

  public insertText(index: number, text: string): any {
    return this.quill.insertText(index, text);
  }

  public insertEmbed(index: number, type: string, value: any): any {
    return this.quill.insertEmbed(index, type, value, 'user');
  }

  public getCurrentSelection(): RangeStatic {
    return this.quill.getSelection(true);
  }


  public getCurrentSelectionIndex(): number {
    return this.getCurrentSelection().index;
  }

  //////////////////////////////////////// ELEMENT MANIP /////////////////////////////////

  /**
   * Return the block element of an element in the text editor
   * @param element
   * @private
   */
  public getEditorBlockElement(element: HTMLElement): HTMLElement {
    let target: HTMLElement = element;
    let previousTarget: HTMLElement = null;

    const editorElement = this.getQlEditorElement();

    while (target != null && target !== editorElement) {
      previousTarget = target;
      target = target.parentElement;
    }

    return previousTarget;
  }

  /**
   * Retrieve the text editor block from an page y position
   * @param pageY
   */
  public getBlockFromMouseYPosition(pageY: number): HTMLElement {
    if (!document) return null;
    const editor = this.getQlEditorElement();

    // Calculate the scroll offset
    const scrollOffset = document.documentElement.scrollTop;

    let previousChild: HTMLElement = editor.childNodes[0] as HTMLElement;
    for (let i = 0; i < editor.childNodes.length; i++) {
      const child: HTMLElement = editor.childNodes[i] as HTMLElement;
      const rect = child.getBoundingClientRect();

      const elementTop = rect.top + scrollOffset;
      // when the top of the rect is greater (meaning bellow the mouse), we stop and return the previous child
      if (elementTop > pageY) {
        // if (elementTop  <= pageY && pageY <= elementTop + child.offsetHeight){
        return previousChild;
      }

      previousChild = child;

    }

    return null;
  }

  /**
   * return true if the element is an empty block in the text editor
   * @param element
   * @private
   */
  public isEmptyBlock(element: HTMLElement): boolean {
    return element.children.length === 1 && (element.childNodes[0] as HTMLElement).tagName === 'BR';
  }

  public getQlEditorElement(): HTMLElement {
    return this.textEditorContainer.querySelector('.ql-editor');
  }


  //////////////////////////////////////// OTHER /////////////////////////////////

  public setDisabled(disabled: boolean): void {
    this.disabled$.next(disabled);
  }

  public getDisabled$(): Observable<boolean> {
    return this.disabled$.asObservable();
  }

  public outsideClick(event: MouseEvent): void {
    this.outsideClick$.next(event);
  }

  public getOutsideClick$(): Observable<MouseEvent> {
    return this.outsideClick$.asObservable();
  }

  ngOnDestroy(): void {
    this.disabled$?.complete();
    this.outsideClick$?.complete();
  }


}
