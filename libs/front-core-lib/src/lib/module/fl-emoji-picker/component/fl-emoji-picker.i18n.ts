import {ClSupportedLanguage} from '@monorepo/core-lib';
import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const flEmojiI18nFr: FlLangTranslation = {
  flEmoji: {
    frequently_used: 'Fréquemment utilisé',
  }
};

const flEmojiI18nEn: FlLangTranslation = {
  flEmoji: {
    frequently_used: 'Frequently used',
  }
};

export const flEmojiI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flEmojiI18nEn,
  [ClSupportedLanguage.fr]: flEmojiI18nFr
};
