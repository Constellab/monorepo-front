import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flFileInputFr: FlLangTranslation = {
  flFileInput: {
    files: 'fichiers',
    select_file: 'Sélectionner un fichier',
    select_files: 'Sélectionner des fichiers',
    clear_input: 'Enlever les fichiers',
    file_wrong_format: 'Le format du ou des fichiers est incorrect, les formats acceptés sont : {{formats}}',
    file_too_big: 'Le ou les fichiers sont trop gros, la limite est de : {{maxSize}}',
  },
};

const flFileInputEn: FlLangTranslation = {
  flFileInput: {
    files: 'files',
    select_file: 'Select a file',
    select_files: 'Select files',
    clear_input: 'Remove files',
    file_wrong_format: 'The format of the file(s) is incorrect, the accepted formats are : {{formats}}',
    file_too_big: 'The file(s) is too big, the limit is : {{maxSize}}',
  },
};

export const FL_FILE_INPUT_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flFileInputFr,
  [ClSupportedLanguage.fr]: flFileInputEn,
};
