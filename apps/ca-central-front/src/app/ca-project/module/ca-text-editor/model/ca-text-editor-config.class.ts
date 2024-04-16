import {CaTextEditorState} from '../state/ca-text-editor.state';
import {CaTextEditorBlockAddButton, CaTextEditorSnowButton} from './ca-text-editor.class';

/**
 * Config for the TextEditor component. It needs to be provided to the component.
 */
export abstract class CaTextEditorConfig {

  public abstract getToolbarConfig(): any;

  public abstract getBlockAddButtons(state: CaTextEditorState): CaTextEditorBlockAddButton[];

  public abstract getSnowButtons(): CaTextEditorSnowButton[];

  public abstract onPasteImage(imgFile: File, state: CaTextEditorState): any;


  public getTheme(themeMode: 'VISIBLE_BUTTON' | 'OVERRIDE_BUTTON'): 'snow' | 'bubble' {
    return themeMode === 'VISIBLE_BUTTON' ? 'snow' : 'bubble';
  }

  public getExtraModules(): any {
    return {};
  }


}

