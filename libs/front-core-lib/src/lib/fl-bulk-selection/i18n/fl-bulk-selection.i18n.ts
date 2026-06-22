import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flBulkSelectionFr: FlLangTranslation = {
  flBulkSelection: {
    multipleSelection: 'Sélection multiple',
    selected: 'sélectionnés',
    selectEntireSearch: 'Sélectionner toute la recherche',
    deselectAll: 'Tout désélectionner',
    entireSearchSelected: 'Toute la recherche sélectionnée',
    close: 'Fermer',
  },
};

const flBulkSelectionEn: FlLangTranslation = {
  flBulkSelection: {
    multipleSelection: 'Multiple selection',
    selected: 'selected',
    selectEntireSearch: 'Select entire search',
    deselectAll: 'Deselect all',
    entireSearchSelected: 'Entire search selected',
    close: 'Close',
  },
};

export const FL_BULK_SELECTION_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flBulkSelectionEn,
  [ClSupportedLanguage.fr]: flBulkSelectionFr,
};
