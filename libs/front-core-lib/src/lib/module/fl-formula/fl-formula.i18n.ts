import {ClSupportedLanguage} from '@monorepo/core-lib';
import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';


/**
 * Translation file for the Spreadsheet module
 */
const flFormulaI18nFr: FlLangTranslation = {
  flFormula: {
    ok: 'Ok',
    formula: 'Formule',
    edit_formula: 'Éditer la formule',
    formula_preview: 'Aperçu',
    formula_help_text: 'L\'éditeur de formule est basé sur le TeX, voici la documentation'
  }
};

const flFormulaI18nEn: FlLangTranslation = {
  flFormula: {
    ok: 'Ok',
    formula: 'Formula',
    edit_formula: 'Edit formula',
    formula_preview: 'Preview',
    formula_help_text: 'The formula editor is based on TeX, here is the documentation'
  }
};

export const flFormulaI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flFormulaI18nEn,
  [ClSupportedLanguage.fr]: flFormulaI18nFr
};
