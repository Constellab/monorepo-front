import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';
import {ClSupportedLanguage} from '@monorepo/core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const flImageFr: FlLangTranslation = {
  flImage: {
    file_is_not_image: 'Le fichier n\'est pas une image',
    select_another_image: 'Sélectionner une autre image',
  }
};

const flImageEn: FlLangTranslation = {
  flImage: {
    file_is_not_image: 'The file is not an image',
    select_another_image: 'Select another image',
  }
};

export const flImageI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flImageEn,
  [ClSupportedLanguage.fr]: flImageFr
};
