import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlStatus } from '@monorepo/front-core-lib/fl-status';
import { FlStatusDict } from '@monorepo/front-core-lib/fl-status';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface UpdateStatusFormDialogInput<S extends string> {
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
    CdkScrollable,
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
  private dialogInput = inject<UpdateStatusFormDialogInput<any>>(MAT_DIALOG_DATA);
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
