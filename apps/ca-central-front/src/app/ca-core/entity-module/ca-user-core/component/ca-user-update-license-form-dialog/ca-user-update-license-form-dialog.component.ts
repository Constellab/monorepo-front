import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { CaUserAccountsService } from '../../../../service-api/ca-user-accounts.service';
import { CaUser, CaUserLicense } from '../../../../model/entities/ca-user.class';

export interface CaUserUpdateLicenseDialogInput {
  userId: string;
  license: CaUserLicense;
}

@Component({
  selector: 'ca-user-update-license-form-dialog',
  templateUrl: './ca-user-update-license-form-dialog.component.html',
  styleUrl: './ca-user-update-license-form-dialog.component.scss',
  standalone: false,
})
export class CaUserUpdateLicenseFormDialogComponent {
  private input = inject<CaUserUpdateLicenseDialogInput>(MAT_DIALOG_DATA);
  private userAccountService = inject(CaUserAccountsService);
  private dialogRef = inject<MatDialogRef<CaUserUpdateLicenseFormDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  formCtrl = new FormControl('' as CaUserLicense, Validators.required);

  licenses = Object.values(CaUserLicense);

  isLoading: boolean = false;

  constructor() {
    const input = this.input;

    this.formCtrl.setValue(input.license);
  }

  submit(): void {
    if (!this.isLoading && this.formCtrl.valid) {
      this.updateLicenses(this.formCtrl.value);
    }
  }

  private updateLicenses(license: CaUserLicense): void {
    this.userAccountService
      .updateLicense(this.input.userId, {
        license: license,
      })
      .subscribe({
        next: (user: CaUser) => this.onUpdateSuccess(user),
        error: () => (this.isLoading = false),
      });
  }

  private onUpdateSuccess(user: CaUser): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'license_updated',
      translateText: true,
    });
    this.dialogRef.close(user);
  }
}
