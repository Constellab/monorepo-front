import { Component, inject } from '@angular/core';
import { FlSnackBarMode } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-cookie-consent',
  templateUrl: './ha-cookie-consent.component.html',
  styleUrls: ['./ha-cookie-consent.component.scss'],
  imports: [MatButton, TranslatePipe],
})
export class HaCookieConsentComponent {
  private snackBarRef = inject<MatSnackBarRef<HaCookieConsentComponent>>(MatSnackBarRef);

  mode: FlSnackBarMode;
  text: FlTranslatableText;

  closeSnackBar(choice: boolean): void {
    if (choice) {
      this.snackBarRef.dismissWithAction();
    } else {
      this.snackBarRef.dismiss();
    }
  }
}
