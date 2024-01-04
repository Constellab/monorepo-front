import {OutputData} from '@editorjs/editorjs';

export type TeTextEditorContent = OutputData;

export class TeTextEditorHelper{

  public static emptyContent(): TeTextEditorContent {
    return {
      time: new Date().getTime(),
      blocks: [],
      version: '2.28.2'
    };
  }
}
