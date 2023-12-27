import {Injectable} from '@angular/core';
import {TeTextEditorState} from './te-text-editor.state';
import {FlHtmlHelper} from '@monorepo/front-core-lib';


interface FlTextEditorStateStore {
  editorElement: HTMLElement;
  state: TeTextEditorState;
}

/**
 * Global state to store all the state of the existing FlTextEditorComponent,
 * useful to retrieve state inside subcomponents
 */
@Injectable({providedIn: 'root'})
export class TeTextEditorsManagerState {

  private states: FlTextEditorStateStore[] = [];

  public registerTextEditor(parentElement: HTMLElement, state: TeTextEditorState): void {

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

  public getState(element: HTMLElement): TeTextEditorState | null {
    const parentElement = FlHtmlHelper.getParent(element, {tagName: 'te-text-editor'});

    if (parentElement == null) {
      return null;
    }

    return this.findStateByParent(parentElement);
  }

  private findStateByParent(parentElement: HTMLElement): TeTextEditorState | null {
    return this.states.find(state => state.editorElement === parentElement)?.state ?? null;
  }
}
