
export enum CaFolderNotifOptions {
  NOTIF_AND_EMAIL = 'NOTIF_AND_EMAIL',
  NOTIF_ONLY = 'NOTIF_ONLY',
  EMAIL_ONLY = 'EMAIL_ONLY',
  NONE = 'NONE',
}

/**
 * Link between folder and user that stores the notification options
 */
export class CaFolderUserConfig {
  folderNotif: CaFolderNotifOptions;

  messageNotif: CaFolderNotifOptions;

  scenarioNotif: CaFolderNotifOptions;

  noteNotif: CaFolderNotifOptions;

  documentNotif: CaFolderNotifOptions;
}
