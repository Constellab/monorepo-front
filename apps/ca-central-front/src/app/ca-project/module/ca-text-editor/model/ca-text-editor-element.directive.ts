import {Directive, ElementRef} from '@angular/core';
import {CaTextEditorsManagerState} from '../state/ca-text-editors-manager.state';
import {CaTextEditorState} from '../state/ca-text-editor.state';
import {Observable} from 'rxjs';

/**
 * Parent class for component that are loaded inside the CaTextEditor
 */
@Directive()
export abstract class CaTextEditorElementDirective {

  protected state: CaTextEditorState;

  protected constructor(protected elementRef: ElementRef<HTMLElement>,
                        managersState: CaTextEditorsManagerState) {
    // retrieve the state of the text editor based on HTML element
    this.state = managersState.getState(elementRef.nativeElement);
  }

  protected getDisabled$(): Observable<boolean> {
    return this.state.getDisabled$();
  }

}
