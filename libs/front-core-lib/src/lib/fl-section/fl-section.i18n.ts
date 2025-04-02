import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flTradFr: FlLangTranslation = {
  flSection: {
    object_not_found: 'Objet non trouvé',
  },
};

const flTradEn: FlLangTranslation = {
  flSection: {
    object_not_found: 'Object not found',
  },
};

export const flSectionI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flTradEn,
  [ClSupportedLanguage.fr]: flTradFr,
};
