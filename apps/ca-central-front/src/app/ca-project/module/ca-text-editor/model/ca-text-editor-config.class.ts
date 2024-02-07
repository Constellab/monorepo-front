import {CaTextEditorState} from '../state/ca-text-editor.state';
import {CaTextEditorBlockAddButton, CaTextEditorSnowButton} from './ca-text-editor.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaTextEditorLinkDialogComponent,
  CaTextEditorLinkDialogInput
} from '../component/ca-text-editor-link-dialog/ca-text-editor-link-dialog.component';
import {
  CaTextEditorFormulaDialogComponent,
  CaTextEditorFormulaDialogInput
} from '../component/ca-text-editor-formula-dialog/ca-text-editor-formula-dialog.component';

/**
 * Config for the TextEditor component. It needs to be provided to the component.
 */
export abstract class CaTextEditorConfig {

  public abstract getToolbarConfig(): any;

  public abstract getBlockAddButtons(state: CaTextEditorState): CaTextEditorBlockAddButton[];

  public abstract getSnowButtons(): CaTextEditorSnowButton[];

  public abstract onPasteImage(imgFile: File, state: CaTextEditorState): any;


  protected getCodeBlockAddButton(state: CaTextEditorState): CaTextEditorBlockAddButton {
    return {
      icon: 'code',
      type: 'button',
      onAction: () => state.insertCodeBlock()
    };
  }

  public getTheme(themeMode: 'VISIBLE_BUTTON' | 'OVERRIDE_BUTTON'): 'snow' | 'bubble' {
    return themeMode === 'VISIBLE_BUTTON' ? 'snow' : 'bubble';
  }

  protected getHintBlockAddButton(state: CaTextEditorState): CaTextEditorBlockAddButton {
    return {
      icon: 'info',
      type: 'button',
      children: [
        {icon: 'info', type: 'button', tooltip: 'caTextEditor.hint_classic', onAction: () => state.insertHint('info')},
        {
          icon: 'warnings',
          type: 'button',
          tooltip: 'caTextEditor.hint_warning',
          onAction: () => state.insertHint('warning')
        },
        {
          icon: 'biotech',
          type: 'button',
          tooltip: 'caTextEditor.hint_scientific',
          onAction: () => state.insertHint('science')
        }
      ],
    };
  }

  protected getQuoteBlockAddButton(state: CaTextEditorState): CaTextEditorBlockAddButton {
    return {
      icon: 'format_quote',
      type: 'button',
      onAction: () => state.insertBlockQuote()
    };
  }

  protected getFormatClearAddButton(state: CaTextEditorState): CaTextEditorBlockAddButton {
    return {
      icon: 'format_clear',
      type: 'button',
      onAction: () => state.removeFormat()
    };
  }

  protected getVideoAddButton(state: CaTextEditorState, dialogService: FlDialogService): CaTextEditorBlockAddButton {
    return {
      icon: 'play_arrow',
      type: 'button',
      onAction: () => this.addVideo(state, dialogService)
    };
  }

  private addVideo(state: CaTextEditorState, dialogService: FlDialogService): void {
    const data: CaTextEditorLinkDialogInput = {
      title: 'caTextEditor.add_a_video',
    };
    const index = state.getCurrentSelectionIndex();
    dialogService.openSmallDialog(CaTextEditorLinkDialogComponent, {data: data}).afterClosed().subscribe(
      (url: string) => {
        if (url) {
          state.insertVideo(url, index);
        }
      });
  }

  protected getFormulaAddButton(state: CaTextEditorState, dialogService: FlDialogService): CaTextEditorBlockAddButton {
    return {
      icon: 'functions',
      type: 'button',
      onAction: () => this.addFormula(state, dialogService),
      tooltip: 'caTextEditor.add_formula'
    };
  }

  private addFormula(state: CaTextEditorState, dialogService: FlDialogService): void {
    const index = state.getCurrentSelectionIndex();

    const input: CaTextEditorFormulaDialogInput = {
      mode: 'create'
    };
    dialogService.openSmallDialog(CaTextEditorFormulaDialogComponent, {data: input}).afterClosed().subscribe(
      (formula: string) => {
        if (formula) {
          state.insertFormula(formula, index);
        }
      });
  }

  public getExtraModules(): any {
    return {};
  }


}

