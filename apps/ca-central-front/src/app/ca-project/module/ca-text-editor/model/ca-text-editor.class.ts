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

  /**
   * Complete toolbar config to enable tools
   * See https://quilljs.com/docs/modules/toolbar/
   */
  public static completeToolbarConfig: any[] = [
    ['bold', 'italic', 'underline', 'strike'],
    ['clean'],
    [{list: 'ordered'}, {list: 'bullet'}],
    [{header: [2, 3, false]}],
    [{align: []}, {indent: '-1'}, {indent: '+1'}],
    ['link', 'blockquote', 'code'],
  ];

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
