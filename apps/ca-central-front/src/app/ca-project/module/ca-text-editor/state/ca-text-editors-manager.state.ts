import {Injectable} from '@angular/core';
import {CaTextEditorState} from './ca-text-editor.state';
import {FlHtmlHelper} from '@monorepo/front-core-lib';


interface FlTextEditorStateStore {
  editorElement: HTMLElement;
  state: CaTextEditorState;
}

/**
 * Global state to store all the state of the existing CaTextEditorComponent,
 * useful to retrieve state inside subcomponents
 */
@Injectable({providedIn: 'root'})
export class CaTextEditorsManagerState {

  public static textEditorElementClass = 'g-text-editor-element';

  private states: FlTextEditorStateStore[] = [];

  constructor() {
  }

  public registerTextEditor(parentElement: HTMLElement, state: CaTextEditorState): void {

    // check if the state was already registered
    const existingState = this.findStateByParent(parentElement);
    if (existingState != null) return;

    this.states.push({
      editorElement: parentElement,
      state: state
    });
  }

  public unregisterTextEditor(parentElement: HTMLElement): void {
    // remove the state from the list
    const index = this.states.findIndex(state => state.editorElement === parentElement);

    if (index >= 0) {
      this.states.splice(index, 1);
    }
  }

  public getState(element: HTMLElement): CaTextEditorState | null {
    const parentElement = FlHtmlHelper.getParent(element, {className: CaTextEditorsManagerState.textEditorElementClass});

    if (parentElement == null) {
      return null;
    }

    return this.findStateByParent(parentElement);
  }

  private findStateByParent(parentElement: HTMLElement): CaTextEditorState | null {
    return this.states.find(state => state.editorElement === parentElement)?.state ?? null;
  }
}
