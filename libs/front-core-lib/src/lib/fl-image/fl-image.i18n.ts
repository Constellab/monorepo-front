import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flImageFr: FlLangTranslation = {
  flImage: {
    file_is_not_image: "Le fichier n'est pas une image",
    select_another_image: 'Sélectionner une autre image',
    save: 'Enregistrer',
  },
};

const flImageEn: FlLangTranslation = {
  flImage: {
    file_is_not_image: 'The file is not an image',
    select_another_image: 'Select another image',
    save: 'Save',
  },
};

export const flImageI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flImageEn,
  [ClSupportedLanguage.fr]: flImageFr,
};
