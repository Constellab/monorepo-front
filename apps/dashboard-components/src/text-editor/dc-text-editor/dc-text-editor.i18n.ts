import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';
import { ClSupportedLanguage } from '@monorepo/core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const dcFr: FlLangTranslation = {
  dc: {},
};

const dcEn: FlLangTranslation = {
  dc: {},
};

export const dcTextEditorI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: dcFr,
  [ClSupportedLanguage.fr]: dcEn,
};
