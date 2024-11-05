import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlLoginFormComponent } from '../fl-login-form/fl-login-form.component';
import { ClCredentials } from '@monorepo/core-lib';

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
})
export class FlCheckCredentialsDialogComponent {
  formGp = FlLoginFormComponent.buildForm();

  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogInput: FlCheckCredentialsDialogInput,
    private dialogRef: MatDialogRef<FlCheckCredentialsDialogComponent>
  ) {}

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
