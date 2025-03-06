import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';
import { ClSupportedLanguage } from '@monorepo/core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const dcFr: FlLangTranslation = {
  error_required: "Le champ '{{field}}' est obligatoire",
  dc: {
    save: 'Save',
    config_not_provided: 'No configuration provided',
    documentation: 'Documentation',
  },
};

const dcEn: FlLangTranslation = {
  error_required: "The field '{{field}}' is required",
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
