import { ClSupportedLanguage } from '@monorepo/core-lib';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/* eslint-disable max-len */
/**
 * Translation file for the Spreadsheet module
 */
const flCoreComponentI18nFr: FlLangTranslation = {
  flCoreComponent: {
    see_more: 'Voir plus',
    hide: 'Cacher',
    byte_symbol: 'o',
    kilo_byte_symbole: 'Ko',
    mega_byte_symbole: 'Mo',
    giga_byte_symbole: 'Go',
    tera_byte_symbole: 'To',
    pin: 'Épingler',
    unpin: 'Désépingler',
    copy_to_clipboard: 'Cliquer pour copier dans le presse-papier',
    copied_to_clipboard: 'Copié dans le presse-papier',
    show: 'Afficher',
  },
};

const flCoreComponentI18nEn: FlLangTranslation = {
  flCoreComponent: {
    see_more: 'See more',
    hide: 'Hide',
    byte_symbol: 'B',
    kilo_byte_symbole: 'KB',
    mega_byte_symbole: 'MB',
    giga_byte_symbole: 'GB',
    tera_byte_symbole: 'TB',
    pin: 'Pin',
    unpin: 'Unpin',
    copy_to_clipboard: 'Click to copy to clipboard',
    copied_to_clipboard: 'Copied to clipboard',
    show: 'Show',
  },
};

export const flCoreComponentI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flCoreComponentI18nEn,
  [ClSupportedLanguage.fr]: flCoreComponentI18nFr,
};
