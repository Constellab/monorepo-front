import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClCredentials } from '@monorepo/core-lib';
import { Observable } from 'rxjs';

import { FlLoginFormComponent } from '../fl-login-form/fl-login-form.component';

export interface FlCheckCredentialsDialogInput {
  onSubmit(credentials: ClCredentials): Observable<any>;
}

/**
 * Component to show the login form in a dialog and call a custom route on
 * submit.
 * This can be useful to check the credentials of the user once connected
 * (to display credentials for example).
 * No captcha nor 2FA is used here.
 */
@Component({
  selector: 'fl-check-credentials-dialog',
  templateUrl: './fl-check-credentials-dialog.component.html',
  styleUrls: ['./fl-check-credentials-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlCheckCredentialsDialogComponent {
  private dialogInput = inject<FlCheckCredentialsDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<FlCheckCredentialsDialogComponent>>(MatDialogRef);

  formGp = FlLoginFormComponent.buildForm();

  isLoading: boolean = false;

  onSubmit(): void {
    if (this.formGp.valid) {
      this.checkCredentials(this.formGp.getRawValue());
    }
  }

  private checkCredentials(credentials: ClCredentials): void {
    this.isLoading = true;
    this.dialogInput.onSubmit(credentials).subscribe({
      next: (result) => this.onCheckSuccess(result),
      error: () => (this.isLoading = false),
    });
  }

  private onCheckSuccess(result: any): void {
    this.isLoading = false;
    this.dialogRef.close(result);
  }
}
