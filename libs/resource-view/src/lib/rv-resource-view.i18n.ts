import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const rvResourceViewI18nFr: FlLangTranslation = {
  rvResourceView: {
    view_type_node_supported: "La vue n'est pas encore supportée, elle le sera très prochainement.",
    error_app_starting: "Erreur lors du démarrage de l'application",
  },
};

const rvResourceViewI18nEn: FlLangTranslation = {
  rvResourceView: {
    view_type_node_supported: 'View not supported. It will be supported in a short notice',
    error_app_starting: 'Error while starting the app',
  },
};

export const rvResourceViewI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: rvResourceViewI18nEn,
  [ClSupportedLanguage.fr]: rvResourceViewI18nFr,
};
