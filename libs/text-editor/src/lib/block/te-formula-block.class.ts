import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {ToolboxConfig, TunesMenuConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {ClRichTextFormula} from '@monorepo/core-lib';
import {Type} from '@angular/core';
import {TeComponentBlock} from './te-component-block.class';
import {TeFormulaComponent} from '../component/te-formula/te-formula.component';

/**
 * Formula block for editor js
 */
export class TeFormulaBlock extends TeComponentBlock<TeFormulaComponent> {

  public static readonly TAG_NAME = 'te-formula';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeFormulaBlock.translateService.translate('flTextEditor.formula'),
      icon: '<span class="material-icons-outlined">functions</span>',
    };
  }

  getComponentType(): Type<TeFormulaComponent> {
    return TeFormulaComponent;
  }

  getTagName(): string {
    return TeFormulaBlock.TAG_NAME;
  }

  initInputs(data: BlockToolData): void {
    this.componentInstance.formulaTitle = data?.title;
    this.componentInstance.caption = data?.caption;
    this.componentInstance.formula$.next(data?.formula);
  }

  save(): BlockToolData {
    return {
      formula: this.componentInstance.formula$.value,
      title: this.componentInstance.formulaTitle,
      caption: this.componentInstance.caption,
    };
  }

  // ignore the formula if it is empty
  validate(blockData: ClRichTextFormula): boolean {
    return blockData?.formula?.length > 0;
  }

  renderSettings(): HTMLElement | TunesMenuConfig {
    return [{
      icon: '<span class="material-icons-outlined">edit</span>',
      title: this.translateService.translate('flTextEditor.edit_formula'),
      onActivate: () => this.componentInstance.updateFormula(),
    }];
  }

  override appendCallback(): void {
    this.componentInstance.openInitFormulaDialog();
  }
}
