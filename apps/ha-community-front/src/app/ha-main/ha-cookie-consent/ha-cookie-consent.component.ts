import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { FlSnackBarMode } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-cookie-consent',
  templateUrl: './ha-cookie-consent.component.html',
  styleUrls: ['./ha-cookie-consent.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
