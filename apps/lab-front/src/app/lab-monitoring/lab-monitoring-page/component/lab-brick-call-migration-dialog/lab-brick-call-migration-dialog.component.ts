import { AsyncPipe } from '@angular/common';
import { ClVersion } from '@monorepo/core-lib';
import { Component, OnInit, inject } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiBrickMigration, LiBrickService } from '@monorepo/lab-lib/li-core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to list available migration a call them manually
 */
@Component({
  selector: 'lab-brick-call-migration-dialog',
  templateUrl: './lab-brick-call-migration-dialog.component.html',
  styleUrls: ['./lab-brick-call-migration-dialog.component.scss'],
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
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabBrickCallMigrationDialogComponent implements OnInit {
  private brickName = inject(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LabBrickCallMigrationDialogComponent>>(MatDialogRef);
  private brickService = inject(LiBrickService);
  private snackBarService = inject(FlSnackBarService);

  brickMigrations$: Observable<LiBrickMigration[]>;

  formControl: FormControl<ClVersion>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.brickMigrations$ = this.brickService.getBrickMigrations(this.brickName);
    this.formControl = new FormControl(null, Validators.required);
  }

  submit(): void {
    if (!this.isLoading && this.formControl.valid) {
      this.callMigration(this.formControl.value);
    }
  }

  private callMigration(version: ClVersion): void {
    this.isLoading = true;

    this.brickService.callMigration(this.brickName, version.toString()).subscribe({
      next: () => this.onSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage({
      text: 'monitoring.call_migration_success',
      translateText: true,
    });
    this.isLoading = false;
    this.dialogRef.close();
  }
}
