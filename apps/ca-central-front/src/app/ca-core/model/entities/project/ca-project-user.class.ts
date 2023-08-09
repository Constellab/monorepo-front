
export enum CaProjectNotifOptions {
  NOTIF_AND_EMAIL = 'NOTIF_AND_EMAIL',
  NOTIF_ONLY = 'NOTIF_ONLY',
  EMAIL_ONLY = 'EMAIL_ONLY',
  NONE = 'NONE',
}

/**
 * Link between project and user that stores the notification options
 */
export class CaProjectUserConfig {
  projectNotif: CaProjectNotifOptions;

  commentNotif: CaProjectNotifOptions;

  experimentNotif: CaProjectNotifOptions;

  reportNotif: CaProjectNotifOptions;

  documentNotif: CaProjectNotifOptions;
}
