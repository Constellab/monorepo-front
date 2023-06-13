import {Component} from '@angular/core';
import {FlSnackBarMode, FlTranslatableText} from '@monorepo/front-core-lib';
import {MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'ha-cookie-consent',
  templateUrl: './ha-cookie-consent.component.html',
  styleUrls: ['./ha-cookie-consent.component.scss'],
})
export class HaCookieConsentComponent {

  mode: FlSnackBarMode;
  text: FlTranslatableText;

  constructor(
    private snackBarRef: MatSnackBarRef<HaCookieConsentComponent>
  ) {
  }

  closeSnackBar(choice: boolean): void {
    if(choice) {
      this.snackBarRef.dismissWithAction();
    } else {
      this.snackBarRef.dismiss();
    }
  }
}
