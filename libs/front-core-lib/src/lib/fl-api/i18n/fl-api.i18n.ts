import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flApiI18nFr: FlLangTranslation = {
  flApi: {
    error_deserialize: 'Erreur pendant la conversion de la réponse en {{className}}',
  },
};

const flApiI18nEn: FlLangTranslation = {
  flApi: {
    error_deserialize: 'Error during the response conversion to {{className}}',
  },
};

export const FL_API_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flApiI18nEn,
  [ClSupportedLanguage.fr]: flApiI18nFr,
};
