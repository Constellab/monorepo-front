/**
 * Config to show a button in the add block menu
 */
import {CaTextEditorState} from '../state/ca-text-editor.state';

export interface CaTextEditorBlockAddButton {
  icon: string;
  tooltip?: string;
  type: 'button' | 'fileExplorer';
  children?: CaTextEditorBlockAddButton[];
  onAction?: (event: any) => void;
}

export interface CaTextEditorSnowButton {
  icon: string;
  tooltip?: string;
  disabled?: boolean;
  type: 'button' | 'fileExplorer';
  onAction?: (event: any, state: CaTextEditorState) => void;
}

/**
 * Static class containing config for Quill
 */
export class CaQuillConfig {

  public static simpleToolbarConfig: any[] = [
    ['bold', 'italic', 'underline'],
    [{list: 'ordered'}, {list: 'bullet'}],
    [{header: [2, 3, false]}],
    ['link', 'clean'],
  ];


}

export interface CaQuillJson {
  ops: any[];
}
