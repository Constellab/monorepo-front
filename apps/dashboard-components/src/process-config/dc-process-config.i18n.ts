import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';
import { ClSupportedLanguage } from '@monorepo/core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const dcFr: FlLangTranslation = {
  dc: {
    save: 'Save',
    config_not_provided: 'No configuration provided',
    documentation: 'Documentation',
  },
};

const dcEn: FlLangTranslation = {
  dc: {
    save: 'Enregistrer',
    config_not_provided: 'Aucune configuration fournie',
    documentation: 'Documentation',
  },
};

export const dcProcessConfigI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: dcFr,
  [ClSupportedLanguage.fr]: dcEn,
};
