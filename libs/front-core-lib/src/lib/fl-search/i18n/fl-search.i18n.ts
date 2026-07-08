import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flSearchFr: FlLangTranslation = {
  flSearch: {
    count_result: '{{count}} Résultats',
    approximate_result: 'Environ {{count}} résultats',
    begin_date: 'Date de début',
    end_date: 'Date de fin',
    search: 'Rechercher',
    date_picker_placeholder: 'jj/mm/aaaa',
  },
};

const flSearchEn: FlLangTranslation = {
  flSearch: {
    count_result: '{{count}} Results',
    approximate_result: 'About {{count}} results',
    begin_date: 'Start date',
    end_date: 'End date',
    search: 'Search',
    date_picker_placeholder: 'dd/mm/yyyy',
  },
};

export const FL_SEARCH_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flSearchEn,
  [ClSupportedLanguage.fr]: flSearchFr,
};
