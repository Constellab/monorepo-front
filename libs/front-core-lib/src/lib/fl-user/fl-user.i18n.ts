import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flCoreComponentI18nFr: FlLangTranslation = {
  flUser: {
    view_profile: 'Voir le profil',
    creation: 'Création',
    last_modification: 'Dernière modification',
  },
};

const flCoreComponentI18nEn: FlLangTranslation = {
  flUser: {
    view_profile: 'View profile',
    creation: 'Creation',
    last_modification: 'Last modification',
  },
};

export const FL_USER_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flCoreComponentI18nEn,
  [ClSupportedLanguage.fr]: flCoreComponentI18nFr,
};
