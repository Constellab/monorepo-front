/**
 * Input for the snack bar info
 */
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

export interface FlSnackBarInfoInput {
  /**
   * The mode of the snack bar
   */
  mode: FlSnackBarMode;

  /**
   * The text of the snack bar
   */
  text: FlTranslatableText;

  /**
   * additional config
   */
  additionalConfig: FlSnackBarAdditionalConfig;
}

/**
 * The mode of the SnackBarInfo
 *
 * If the mode is 'success' the snackbar background is the primary color
 *
 * If the mode is 'error' the snackbar background is the warn color
 */
export type FlSnackBarMode = 'success' | 'error';

export interface FlSnackBarAdditionalConfig {
  /**
   * if true a close button is shown in the snackbar
   * default to true
   */
  showCloseButton?: boolean;
}

export const FL_SNACKBAR_ADDITIONAL_CONFIG_DEFAULT: FlSnackBarAdditionalConfig = {
  showCloseButton: true,
};
