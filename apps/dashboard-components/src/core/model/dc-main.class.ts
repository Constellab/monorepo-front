/**
 * Auth info for the dc components
 * This info is provided in the init data of the dc components
 */
export interface DcAuthenticationInfo {
  app_id: string;
  user_access_token: string;
}

export interface DcLabInfo {
  lab_api_url: string;
  authentication_info: DcAuthenticationInfo;
}

/**
 * Object passed to the dashboard components
 */
export interface DcMainConfig {
  /**
   * Object provided if the component supports lab api calls
   */
  lab_info?: DcLabInfo;
  data?: any;
}
