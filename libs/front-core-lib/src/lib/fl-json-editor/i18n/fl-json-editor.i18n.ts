import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flJsonEditorI18nFr: FlLangTranslation = {
  flJsonEditor: {
    object_not_supported: 'Object non supporté',
    copy_json_to_clipboard: 'Copier le JSON dans le presse-papier',
    json_copied_to_clipboard: 'JSON copié dans le presse-papier',
  },
};

const flJsonEditorI18nEn: FlLangTranslation = {
  flJsonEditor: {
    object_not_supported: 'Object not supported',
    copy_json_to_clipboard: 'Copy JSON to clipboard',
    json_copied_to_clipboard: 'JSON copied to clipboard',
  },
};

export const FL_JSON_EDITOR_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flJsonEditorI18nEn,
  [ClSupportedLanguage.fr]: flJsonEditorI18nFr,
};
