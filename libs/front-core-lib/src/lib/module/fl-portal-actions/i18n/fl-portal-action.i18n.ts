import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const flPortalActionFr: FlLangTranslation = {
  flPortalAction: {
    actions: 'Actions',
    close: 'Fermer',
  },
};

const flPortalActionEn: FlLangTranslation = {
  flPortalAction: {
    actions: 'Actions',
    close: 'Close',
  },
};

export const flPortalActionI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flPortalActionEn,
  [ClSupportedLanguage.fr]: flPortalActionFr,
};
