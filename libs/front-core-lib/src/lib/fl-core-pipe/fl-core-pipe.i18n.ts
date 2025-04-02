import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flTradFr: FlLangTranslation = {
  flCorePipe: {
    error_required: 'Le champ \'{{field}}\' est obligatoire',
  },
};

const flTradEn: FlLangTranslation = {
  flCorePipe: {
    error_required: 'The field \'{{field}}\' is mandatory',
  },
};

export const flCorePipeI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flTradEn,
  [ClSupportedLanguage.fr]: flTradFr,
};
