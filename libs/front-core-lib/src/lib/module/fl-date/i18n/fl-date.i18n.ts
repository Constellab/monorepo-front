import {ClSupportedLanguage} from '@monorepo/core-lib';
import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';


/**
 * Translation file for the Spreadsheet module
 */
const flDateI18nFr: FlLangTranslation = {
  flDate: {
    created_by: 'Created by',
    last_modified_by: 'Last modified by',
    last_sync_by: 'Dernière synchronisation par',
    date_picker_placeholder: "jj/mm/aaaa",
    day: "Jour",
    hour: "Heure",
    minute: "Minute",
  }
};

const flDateI18nEn: FlLangTranslation = {
  flDate: {
    created_by: 'Créé par',
    last_modified_by: 'Dernière modification par',
    last_sync_by: 'Last synchronisation by',
    date_picker_placeholder: "dd/mm/yyyy",
    day: "Day",
    hour: "Hour",
    minute: "Minute",
  }
};

export const flDateI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flDateI18nEn,
  [ClSupportedLanguage.fr]: flDateI18nFr
};
