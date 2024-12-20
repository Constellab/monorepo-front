import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';

/**
 * Translation file for the Spreadsheet module
 */
const flDialogFr: FlLangTranslation = {
  flDialog: {
    confirm_with_text: 'Confirm the action by typing the text',
    confirm_text: 'Confirmation text',
    invalid_confirm_text: 'Invalid confirmation text',
    close: 'Fermer',
    yes: 'Oui',
    no: 'Non',
  },
};

const flDialogEn: FlLangTranslation = {
  flDialog: {
    confirm_with_text: "Confirmer l'action en tapant le texte",
    confirm_text: 'Texte de confirmation',
    invalid_confirm_text: 'Texte de confirmation invalide',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
  },
};

export const flDialogI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flDialogFr,
  [ClSupportedLanguage.fr]: flDialogEn,
};
