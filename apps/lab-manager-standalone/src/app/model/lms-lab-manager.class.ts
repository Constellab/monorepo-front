/**
 * Object to config the lab manager required on init
 */
export interface LmsLabManagerConfiguration {
  space: {
    apiUrl: string;
    prodApiKey: string;
    devApiKey: string;
    frontUrl: string;
  };
  community: {
    apiUrl: string;
    apiKey: string;
    frontUrl: string;
  };
  codelabToken: string;
  gwsCoreProdPassword: string;
  gwsCoreDevPassword: string;
  labConfig: {
    enableBackup: boolean;
  };
  captchaSiteKey: string;
  openaiApiKey: string;
}
