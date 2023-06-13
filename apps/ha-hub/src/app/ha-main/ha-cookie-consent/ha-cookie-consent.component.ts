import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ha-cookie-consent',
  templateUrl: './ha-cookie-consent.component.html',
  styleUrls: ['./ha-cookie-consent.component.scss'],
})
export class HaCookieConsentComponent {

  constructor(
    private dialogRef: MatDialogRef<HaCookieConsentComponent>,
  ) {
  }

  closeDialog(choice: boolean): void {
    this.dialogRef.close(choice);
  }
}
