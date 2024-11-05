import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const flEmojiI18nFr: FlLangTranslation = {
  flEmoji: {
    category_frequent: 'Fréquemment utilisé',
    category_people: 'Personnes',
    category_nature: 'Nature',
    category_foods: 'Nourritures',
    category_activity: 'Activité',
    category_places: 'Lieux',
    category_objects: 'Objets',
    category_symbols: 'Symboles',
    category_flags: 'Drapeaux',
  },
};

const flEmojiI18nEn: FlLangTranslation = {
  flEmoji: {
    category_frequent: 'Frequently used',
    category_people: 'People',
    category_nature: 'Nature',
    category_foods: 'Foods',
    category_activity: 'Activity',
    category_places: 'Places',
    category_objects: 'Objects',
    category_symbols: 'Symbols',
    category_flags: 'Flags',
  },
};

export const flEmojiI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flEmojiI18nEn,
  [ClSupportedLanguage.fr]: flEmojiI18nFr,
};
