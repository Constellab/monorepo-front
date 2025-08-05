import { Component, inject,OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { FlUserAccountService } from '../../service/fl-user-account.service';

/**
 * Dialog with a simple form where the user enter his email to receive the
 * password forgotten email
 */
@Component({
  selector: 'fl-password-forgotten',
  templateUrl: './fl-password-forgotten.component.html',
  styleUrls: ['./fl-password-forgotten.component.scss'],
  standalone: false,
})
export class FlPasswordForgottenComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<FlPasswordForgottenComponent>>(MatDialogRef);
  private userAccountsService = inject(FlUserAccountService);
  private snackBarService = inject(FlSnackBarService);

  formControl: FormControl<string>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formControl = new FormControl<string>(null, [Validators.required, Validators.email]);
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.callPasswordForgotten(this.formControl.value);
    }
  }

  private callPasswordForgotten(email: string): void {
    this.isLoading = true;
    this.userAccountsService.passwordForgotten(email).subscribe(
      () => this.onSuccess(),
      () => (this.isLoading = false)
    );
  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage(
      { text: 'flAuth.password_forgotten_mail_sent', translateText: true },
      7000
    );

    this.dialogRef.close();
  }
}
