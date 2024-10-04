import { Observable } from 'rxjs';
import { FlTranslatableText } from '../../fl-translate/model/fl-translate-param';

/**
 * Input data for the {@link FlConfirmDialogComponent}
 */
export interface FlConfirmDialogInput {
  /**
   * Title of the dialog, supports HTML
   */
  title: FlTranslatableText;

  /**
   * Content of the dialog, supports HTML
   */
  content: FlTranslatableText;

  /**
   * Optional observable, if filled, the observable is called
   * when the user press 'Yes' and the dialog is can't be closed until
   * the observable completes. The dialog returns the observable result
   */
  observable?: Observable<any>;

  /**
   * Optional message. If filled, a snackbar with the message is shown
   * when click 'yes' or when the observable completes successfully.
   */
  successMessage?: FlTranslatableText;

  /**
   * If provided, the user must confirm the action by typing the text in the input
   */
  confirmWithText?: string;
}

/**
 * Object returned by the {@link FlConfirmDialogResult}
 * when calling the openConfirmDialog from {@link FlDialogService}
 */
export interface FlConfirmDialogResult<T = any> {
  /**
   * True if the user pressed 'Yes', false otherwise.
   */
  choice: boolean;

  /**
   * Fill by the observable result if the observable was provided
   */
  result?: T;
}
