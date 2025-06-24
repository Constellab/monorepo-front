import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flTagI18nFr: FlLangTranslation = {
  flTag: {
    search_tag: 'Rechercher des tags',
    tags: 'Tags',
    input_helper_text: "'Entrer' pour sélectionner un tag. 'Tab' pour ajouter un nouveau tag",
    basic_input_helper_text: "'Entrer' ou 'Tab' pour ajouter un tag",
    update_tags: 'Modifier les tags',
    no_tag: 'Aucun tag',
    import_from_community: 'Importer depuis Community',
  },
};

const flTagI18nEn: FlLangTranslation = {
  flTag: {
    search_tag: 'Search tags',
    tags: 'Tags',
    input_helper_text: "'Enter' to select tag. 'Tab' to add a new tag",
    basic_input_helper_text: "'Enter' or 'Tab' to add a tag",
    update_tags: 'Update tags',
    no_tag: 'No tag',
    import_from_community: 'Import from Community',
  },
};

export const flTagI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flTagI18nEn,
  [ClSupportedLanguage.fr]: flTagI18nFr,
};
