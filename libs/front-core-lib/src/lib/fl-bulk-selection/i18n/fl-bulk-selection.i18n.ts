import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flBulkSelectionFr: FlLangTranslation = {
  flBulkSelection: {
    multipleSelection: 'Sélection multiple',
    ctrlClickHint: 'Ctrl/⌘ + clic sur une ligne pour activer',
    selected: 'sélectionnés',
    selectAllVisible: 'Tout sélectionner',
    selectEntireSearch: 'Sélectionner toute la recherche',
    deselectAll: 'Tout désélectionner',
    entireSearchSelected: 'Toute la recherche sélectionnée',
    close: 'Fermer',
    bulkResultTitle: "Résultat de l'opération",
    total: 'Total',
    succeeded: 'Réussis',
    failed: 'Échoués',
    errorName: 'Nom',
    errorMessage: "Message d'erreur",
  },
};

const flBulkSelectionEn: FlLangTranslation = {
  flBulkSelection: {
    multipleSelection: 'Multiple selection',
    ctrlClickHint: 'Ctrl/⌘ + click a row to activate',
    selected: 'selected',
    selectAllVisible: 'Select all',
    selectEntireSearch: 'Select entire search',
    deselectAll: 'Deselect all',
    entireSearchSelected: 'Entire search selected',
    close: 'Close',
    bulkResultTitle: 'Operation result',
    total: 'Total',
    succeeded: 'Succeeded',
    failed: 'Failed',
    errorName: 'Name',
    errorMessage: 'Error message',
  },
};

export const FL_BULK_SELECTION_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flBulkSelectionEn,
  [ClSupportedLanguage.fr]: flBulkSelectionFr,
};
