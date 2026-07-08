import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flDialogEn: FlLangTranslation = {
  flDialog: {
    confirm_with_text: 'Confirm the action by typing the text',
    confirm_text: 'Confirmation text',
    invalid_confirm_text: 'Invalid confirmation text',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    warning: 'Warning',
    cancel: 'Cancel',
  },
};

const flDialogFr: FlLangTranslation = {
  flDialog: {
    confirm_with_text: "Confirmer l'action en tapant le texte",
    confirm_text: 'Texte de confirmation',
    invalid_confirm_text: 'Texte de confirmation invalide',
    close: 'Fermer',
    yes: 'Oui',
    no: 'Non',
    warning: 'Avertissement',
    cancel: 'Annuler',
  },
};

export const FL_DIALOG_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flDialogEn,
  [ClSupportedLanguage.fr]: flDialogFr,
};
