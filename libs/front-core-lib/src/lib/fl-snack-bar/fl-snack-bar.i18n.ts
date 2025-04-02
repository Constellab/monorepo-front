import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flTradFr: FlLangTranslation = {
  flSnackBar: {
    details: 'Détail',
    ok : 'Ok',
  },
};

const flTradEn: FlLangTranslation = {
  flSnackBar: {
    details: 'Details',
    ok : 'Ok',
  },
};

export const flSnackBarI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flTradEn,
  [ClSupportedLanguage.fr]: flTradFr,
};
