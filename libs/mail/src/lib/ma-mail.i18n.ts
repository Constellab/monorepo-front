import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const fr: FlLangTranslation = {
  maMail: {
    mails: 'Mails',
    id: 'Id',
    recipients: 'Destinataire',
    subject: 'Sujet',
    lastModifiedAt: 'Dernière modification',
    status: 'Status',
    error: 'Error',
    status_PENDING: 'En attente',
    status_SENT: 'Envoyé',
    status_ERROR: 'Erreur',
    resendMail: 'Renvoyer le mail',
    resendMailConfirmation: 'Étes-vous sûr de vouloir renvoyer ce mail ?',
    resendMailSuccess: 'Mail renvoyé',
    ok: 'Ok',
    content: 'Contenu',
  },
};

const en: FlLangTranslation = {
  maMail: {
    mails: 'Mails',
    id: 'Id',
    recipients: 'Recipients',
    subject: 'Subject',
    lastModifiedAt: 'Last modification',
    status: 'Status',
    error: 'Error',
    status_PENDING: 'Pending',
    status_SENT: 'Sent',
    status_ERROR: 'Error',
    resendMail: 'Resend mail',
    resendMailConfirmation: 'Are you sure you want to resend this mail ?',
    resendMailSuccess: 'Mail resent',
    ok: 'Ok',
    content: 'Content',
  },
};

export const MA_MAIL_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: en,
  [ClSupportedLanguage.fr]: fr,
};
