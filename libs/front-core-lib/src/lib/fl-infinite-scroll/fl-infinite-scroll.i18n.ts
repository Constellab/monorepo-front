import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flTradFr: FlLangTranslation = {
  flInfiniteScroll: {
    show_more_result: 'Afficher plus de résultat',
    no_more_result: 'Aucun résultat supplémentaire',
    no_result: 'Aucun résultat',
  },
};

const flTradEn: FlLangTranslation = {
  flInfiniteScroll: {
    show_more_result: 'Show more results',
    no_more_result: 'No more result',
    no_result: 'No result',
  },
};

export const FL_INFINITE_SCROLL_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flTradEn,
  [ClSupportedLanguage.fr]: flTradFr,
};
