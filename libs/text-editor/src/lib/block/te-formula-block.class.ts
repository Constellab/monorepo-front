import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { Type } from '@angular/core';
import { TeComponentBlock } from './te-component-block.class';
import { TeFormulaComponent } from '../component/te-formula/te-formula.component';
import { TeHelper } from '../model/te.helper';
import { MenuConfig } from '@editorjs/editorjs/types/tools';

/**
 * Object representing the value stored to create a formula
 */
export interface TeFormulaBlockData {
  formula: string;
  title?: string;
  caption?: string;
}

/**
 * Formula block for editor js
 */
export class TeFormulaBlock extends TeComponentBlock<TeFormulaComponent> {
  public static readonly TAG_NAME = 'te-formula';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('flFormula.formula'),
      icon: TeHelper.getMatIconElement('functions'),
    };
  }

  getComponentType(): Type<TeFormulaComponent> {
    return TeFormulaComponent;
  }

  getTagName(): string {
    return TeFormulaBlock.TAG_NAME;
  }

  initInputs(data: TeFormulaBlockData): void {
    this.componentInstance.formulaTitle = data?.title;
    this.componentInstance.caption = data?.caption;
    this.componentInstance.formula$.next(data?.formula);
    this.componentInstance.helpText = { text: 'teTextEditor.formula_help', translateText: true };
  }

  save(): TeFormulaBlockData {
    return {
      formula: this.componentInstance.formula$.value,
      title: this.componentInstance.formulaTitle,
      caption: this.componentInstance.caption,
    };
  }

  // ignore the formula if it is empty
  validate(blockData: TeFormulaBlockData): boolean {
    return blockData?.formula?.length > 0;
  }

  renderSettings(): HTMLElement | MenuConfig {
    return [
      {
        icon: TeHelper.getMatIconElement('edit'),
        title: TeHelper.getTranslateService().translate('flFormula.edit_formula'),
        onActivate: () => this.componentInstance.updateFormula(),
      },
    ];
  }

  override appendCallback(): void {
    this.componentInstance.openInitFormulaDialog();
  }
}
