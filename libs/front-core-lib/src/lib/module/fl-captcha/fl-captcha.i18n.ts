import {ClSupportedLanguage} from '@monorepo/core-lib';
import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';


/**
 * Translation file for the Spreadsheet module
 */
const flCaptchaI18nFr: FlLangTranslation = {
  flCaptcha: {
    error: 'Une erreur est survenue lors de la validation du captcha',
  }
};

const flCaptchaI18nEn: FlLangTranslation = {
  flCaptcha: {
    error: 'An error occurred while validating the captcha',
  }
};

export const flCaptchaI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flCaptchaI18nEn,
  [ClSupportedLanguage.fr]: flCaptchaI18nFr
};
