import { AbstractControl } from '@angular/forms';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

/**
 * Type use in chips inside  {@link FlFormInputsManagerComponent}
 */
export interface FlFormFilledInput {
  /**
   * key for the form input
   */
  key: string;

  /**
   * Displayed name for the form input
   */
  name: FlTranslatableText;

  /**
   * Form control
   */
  control: AbstractControl;
}

/**
 * Config object for the {@link FlFormInputsManagerComponent}
 *
 * This config is used to display the name of the input (that has been filled) in the chip
 * It doesn't go deeper event if it is a FormGroup
 */
export type FlFormInputsManagerConfig<T = any> = {
  [P in keyof T]?: FlTranslatableText;
};
