import EditorJS from '@editorjs/editorjs';
import {Signal, signal, WritableSignal} from '@angular/core';

export class TeTextEditorState {

  public textEditorContainer: HTMLElement;

  public editor: EditorJS;

  private disabled: WritableSignal<boolean>;

  constructor(editor: EditorJS, textEditorContainer: HTMLElement, disabled: boolean) {
    this.editor = editor;
    this.textEditorContainer = textEditorContainer;
    this.disabled = signal(disabled);
  }

  //////////////////////////////////////// OTHER /////////////////////////////////

  public setDisabled(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  public get disabled$(): Signal<boolean> {
    return this.disabled.asReadonly();
  }

}
