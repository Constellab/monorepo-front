import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flBulkSelectionFr: FlLangTranslation = {
  flBulkSelection: {
    multipleSelection: 'Sélection multiple',
    selected: 'sélectionnés',
    selectAll: 'Tout sélectionner',
    deselectAll: 'Tout désélectionner',
    allSelected: 'Tout sélectionné',
    close: 'Fermer',
  },
};

const flBulkSelectionEn: FlLangTranslation = {
  flBulkSelection: {
    multipleSelection: 'Multiple selection',
    selected: 'selected',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    allSelected: 'All selected',
    close: 'Close',
  },
};

export const FL_BULK_SELECTION_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flBulkSelectionEn,
  [ClSupportedLanguage.fr]: flBulkSelectionFr,
};
