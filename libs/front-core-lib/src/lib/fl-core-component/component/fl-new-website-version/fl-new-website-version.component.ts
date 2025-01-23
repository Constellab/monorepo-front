import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'fl-new-website-version',
  templateUrl: './fl-new-website-version.component.html',
  styleUrls: ['./fl-new-website-version.component.scss'],
  standalone: false,
})
export class FlNewWebsiteVersionComponent {
  private snackBarRef = inject<MatSnackBarRef<FlNewWebsiteVersionComponent>>(MatSnackBarRef);

  reload(): void {
    location.reload();
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
