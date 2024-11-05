import { ClSupportedLanguage } from '@monorepo/core-lib';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib';

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

export const flJsonEditorI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flJsonEditorI18nEn,
  [ClSupportedLanguage.fr]: flJsonEditorI18nFr,
};
