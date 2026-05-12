import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flResizeI18nFr: FlLangTranslation = {
  flResize: {
    set_fullscreen: 'Plein écran',
    remove_fullscreen: 'Enlever le plein écran',
  },
};

const flResizeI18nEn: FlLangTranslation = {
  flResize: {
    set_fullscreen: 'Fullscreen',
    remove_fullscreen: 'Remove fullscreen',
  },
};

export const FL_RESIZE_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flResizeI18nEn,
  [ClSupportedLanguage.fr]: flResizeI18nFr,
};
