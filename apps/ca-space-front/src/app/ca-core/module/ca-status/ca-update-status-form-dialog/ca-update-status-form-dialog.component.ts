import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlStatus, FlStatusDict } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface CaUpdateStatusFormDialogInput<S extends string> {
  statusDict: FlStatusDict<S>;
  currentStatus: FlStatus<S>;
  title?: string;

  updateStatus(status: S): Observable<any>;
}

/**
 * Generic form dialog to update the status of an entity
 */
@Component({
  selector: 'ca-update-status-form-dialog',
  templateUrl: './ca-update-status-form-dialog.component.html',
  styleUrls: ['./ca-update-status-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaUpdateStatusFormDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<CaUpdateStatusFormDialogComponent>>(MatDialogRef);
  private dialogInput = inject<CaUpdateStatusFormDialogInput<any>>(MAT_DIALOG_DATA);
  private snackBarService = inject(FlSnackBarService);

  formControl: FormControl;
  statusDict: FlStatusDict;

  isLoading: boolean;

  constructor() {
    const dialogInput = this.dialogInput;

    this.statusDict = dialogInput.statusDict;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // create form control with a validator to verify that the status has changed
    this.formControl = new FormControl(this.dialogInput.currentStatus.value, [
      Validators.required,
      FlGlobalValidators.differentValue(this.dialogInput.currentStatus.value),
    ]);
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.updateStatus(this.formControl.value);
    }
  }

  private updateStatus(status: any): void {
    this.isLoading = true;
    this.dialogInput.updateStatus(status).subscribe({
      next: (entity) => this.updateStatusSuccess(entity),
      error: () => (this.isLoading = false),
    });
  }

  private updateStatusSuccess(entity: any): void {
    this.snackBarService.openSuccessMessage({ text: 'status_updated', translateText: true });

    this.isLoading = false;
    this.dialogRef.close(entity);
  }

  get title(): string {
    return this.dialogInput.title ?? 'update_status';
  }
}
