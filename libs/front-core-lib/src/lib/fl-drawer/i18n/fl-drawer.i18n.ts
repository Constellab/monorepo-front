import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flDrawerI18nFr: FlLangTranslation = {
  flDrawer: {
    toggle_sidebar: 'Afficher/masquer le panneau latéral',
  },
};

const flDrawerI18nEn: FlLangTranslation = {
  flDrawer: {
    toggle_sidebar: 'Toggle sidebar',
  },
};

export const FL_DRAWER_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flDrawerI18nEn,
  [ClSupportedLanguage.fr]: flDrawerI18nFr,
};
