import {ScrollDispatcher} from '@angular/cdk/overlay';
import {ElementRef} from '@angular/core';
import {CaTextEditorState} from '../state/ca-text-editor.state';
import {CaTextEditorConfig} from './ca-text-editor-config.class';
import {ClStringHelper} from '@monorepo/core-lib';
import {FlFileHelper} from '@monorepo/front-core-lib';

/**
 * Detect the scrolling container for the text editor
 * - 'auto' will detect the first parent that is scrollable
 * - 'child' will use the child .ql-editor as scrollable
 * - 'body' will use the body as scrollable
 */
export type CaQuillScrollContainer = 'auto' | 'child' | 'body';

export class CaQuillSetup {

  // retrieve the first parent that is scrollable
  public static getScrollingContainer(scrollContainer: CaQuillScrollContainer, scrollDispatcher: ScrollDispatcher,
                                      documentElement: HTMLElement,
                                      elementRef: ElementRef): HTMLElement | string {
    if (scrollContainer === 'child') return '.ql-editor';
    if (scrollContainer === 'body') return documentElement;

    // retrieve scrollable parents
    const scrollableElements = scrollDispatcher.getAncestorScrollContainers(elementRef);

    // if there are some scrollable parent, use the first one
    if (scrollableElements.length > 0) {
      return scrollableElements[scrollableElements.length - 1].getElementRef().nativeElement;
    }

    // otherwise, use document as scrolling container
    return documentElement;
  }

  public static addMatcherLink(index: number, link: string, delta: any, state: CaTextEditorState): any {
    return state.createLink(index, link, link);
  }

  public static addMatcher(node: any, delta: any, state: CaTextEditorState, config: CaTextEditorConfig): any {
    const insertImage: any = delta.ops[0].insert;
    const firstDelta: any = delta;
    const imageData: string = insertImage.image;
    if (imageData.startsWith('http')) {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        0;
        delta = state.insertImageFromUrl({
          filename: img.src,
          width: img.width,
          height: img.height
        }, state.getCurrentSelectionIndex());

        return delta;
      };
    } else if (imageData.startsWith('data')) {
      const blob: Blob = FlFileHelper.convertBase64ToBlob(insertImage.image.split(',')[1], 'image/png');
      delta = config.onPasteImage(new File([blob], ClStringHelper.generateUUID()), state);
      return delta;
    }

    return firstDelta == delta ? {ops: []} : delta;
  }

}
