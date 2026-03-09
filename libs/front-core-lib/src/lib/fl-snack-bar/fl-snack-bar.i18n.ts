import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flTradFr: FlLangTranslation = {
  flSnackBar: {
    ok: 'Ok',
  },
};

const flTradEn: FlLangTranslation = {
  flSnackBar: {
    ok: 'Ok',
  },
};

export const FL_SNACK_BAR_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flTradEn,
  [ClSupportedLanguage.fr]: flTradFr,
};
