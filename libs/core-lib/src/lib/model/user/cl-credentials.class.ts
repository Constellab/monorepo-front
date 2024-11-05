/**
 * Object to send to log in
 */
export interface ClCredentials {
  email: string;
  password: string;
  captcha?: string;
}

/**
 * Object to send to log in
 */
export interface ClCredentials2Fa {
  twoFAUrlCode: string;
  twoFACode: string;
}
