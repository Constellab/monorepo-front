import {CaTextEditorConfig} from './ca-text-editor-config.class';
import {CaQuillConfig, CaTextEditorBlockAddButton, CaTextEditorSnowButton} from './ca-text-editor.class';
import {CaTextEditorState} from '../state/ca-text-editor.state';

/**
 * Basic config for the TextEditor no add block button and minimum toolbar actions
 */
export class CaTextEditorBasicConfig extends CaTextEditorConfig {
  getBlockAddButtons(): CaTextEditorBlockAddButton[] {
    return [];
  }

  getToolbarConfig(): any {
    return CaQuillConfig.simpleToolbarConfig;
  }

  onPasteImage(imgFile: File, state: CaTextEditorState): any {
    return null;
  }

  getSnowButtons(): CaTextEditorSnowButton[] {
    return [];
  }

}
