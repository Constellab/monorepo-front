import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Simple dialog to show error message of mail sending
 */
@Component({
  selector: 'ma-mail-error-dialog',
  templateUrl: './ma-mail-error-dialog.component.html',
  styleUrl: './ma-mail-error-dialog.component.scss',
  standalone: false,
})
export class MaMailErrorDialogComponent {
  error = inject(MAT_DIALOG_DATA);
}
