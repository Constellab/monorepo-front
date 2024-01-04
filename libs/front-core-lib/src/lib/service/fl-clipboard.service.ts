import {Injectable} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {FlSnackBarService} from '../module/fl-snack-bar/fl-snack-bar.service';
import {FlTranslatableText} from '../module/fl-translate/model/fl-translate-param';

/**
 * Service to manage clipboard
 */
@Injectable({providedIn: 'root'})
export class FlClipboardService {


  constructor(private clipboard: Clipboard,
              private snackBarService: FlSnackBarService) {
  }

  /**
   * Copies the provided text into the user's clipboard.
   * Params: text – The string to copy.
   * Returns:Whether the operation was successful.
   */
  public copy(text: string, successText?: FlTranslatableText): boolean {
    const result = this.clipboard.copy(text);

    if (successText) {
      this.snackBarService.openSuccessMessage(successText);
    }

    return result;
  }

  /**
   * returns the copied text
   */
  public readText(): Promise<string | null> {
    if (navigator.clipboard) {
      return navigator.clipboard.readText();
    } else {
      return Promise.resolve() as Promise<null>;
    }
  }
}
