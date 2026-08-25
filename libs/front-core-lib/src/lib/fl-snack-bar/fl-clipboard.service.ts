import { Clipboard } from '@angular/cdk/clipboard';
import { inject, Injectable } from '@angular/core';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { FlSnackBarService } from './fl-snack-bar.service';

/**
 * Service to manage clipboard
 */
@Injectable({ providedIn: 'root' })
export class FlClipboardService {
  private clipboard = inject(Clipboard);
  private snackBarService = inject(FlSnackBarService);

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
      return Promise.resolve(null);
    }
  }
}
