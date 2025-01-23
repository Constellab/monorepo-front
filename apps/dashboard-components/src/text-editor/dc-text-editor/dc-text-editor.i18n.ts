import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';
import { ClSupportedLanguage } from '@monorepo/core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const dcFr: FlLangTranslation = {
  error_required: "Le champ '{{field}}' est obligatoire",
  dc: {},
};

const dcEn: FlLangTranslation = {
  error_required: "The field '{{field}}' is required",
  dc: {},
};

export const dcI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: dcFr,
  [ClSupportedLanguage.fr]: dcEn,
};
