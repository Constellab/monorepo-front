import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flColorI18nFr: FlLangTranslation = {
  flColor: {
    select_color: 'Sélectionner une couleur',
  },
};

const flColorI18nEn: FlLangTranslation = {
  flColor: {
    select_color: 'Select a color',
  },
};

export const FL_COLOR_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flColorI18nEn,
  [ClSupportedLanguage.fr]: flColorI18nFr,
};
