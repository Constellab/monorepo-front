import {CaTextEditorConfig} from './ca-text-editor-config.class';
import {CaQuillConfig, CaTextEditorBlockAddButton, CaTextEditorSnowButton} from './ca-text-editor.class';

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

  onPasteImage(): any {
    return null;
  }

  getSnowButtons(): CaTextEditorSnowButton[] {
    return [];
  }

}
