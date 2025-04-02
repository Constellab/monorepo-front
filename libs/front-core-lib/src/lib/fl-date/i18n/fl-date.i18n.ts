import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flDateI18nFr: FlLangTranslation = {
  flDate: {
    created_by: 'Created by',
    last_modified_by: 'Last modified by',
    last_sync_by: 'Dernière synchronisation par',
    day: 'Jour',
    hour: 'Heure',
    minute: 'Minute',
    between_the_from: 'Entre le',
    between_the_to: 'et le',
    from_the: 'Du',
    until_the: "Jusqu'au",
  },
};

const flDateI18nEn: FlLangTranslation = {
  flDate: {
    created_by: 'Créé par',
    last_modified_by: 'Dernière modification par',
    last_sync_by: 'Last synchronisation by',
    day: 'Day',
    hour: 'Hour',
    minute: 'Minute',
    between_the_from: 'From the',
    between_the_to: 'to the',
    from_the: 'From the',
    until_the: "Jusqu'au",
  },
};

export const flDateI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flDateI18nEn,
  [ClSupportedLanguage.fr]: flDateI18nFr,
};
