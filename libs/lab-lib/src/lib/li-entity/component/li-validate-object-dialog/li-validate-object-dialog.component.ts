import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiEntity, LiFolder } from '@monorepo/lab-lib/li-core';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface LiValidateObjectDialogInput {
  title: string;

  helpText?: string;

  validate(folder: LiFolder): Observable<any>;

  successMessage: string;

  folder?: LiEntity;
}

/**
 * Generic dialog to validate an object by selecting a folder.
 * This works for scenarios and notes
 */
@Component({
  selector: 'li-validate-object-dialog',
  templateUrl: './li-validate-object-dialog.component.html',
  styleUrls: ['./li-validate-object-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    LiFolderSelectComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiValidateObjectDialogComponent implements OnInit {
  private dialogInput = inject<LiValidateObjectDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LiValidateObjectDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  title: string;
  helpText: string;

  formControl: FormControl;

  isLoading: boolean = false;

  constructor() {
    this.title = this.dialogInput.title;
    this.helpText = this.dialogInput.helpText;
  }

  ngOnInit(): void {
    this.initFormControl();
  }

  private initFormControl(): void {
    this.formControl = new FormControl(this.dialogInput.folder, Validators.required);
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.isLoading = true;
      this.validateObject(this.formControl.value);
    }
  }

  private validateObject(folder: LiFolder): void {
    this.dialogInput.validate(folder).subscribe(
      (object) => this.validateSuccess(object),
      () => (this.isLoading = false)
    );
  }

  private validateSuccess(object: any): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage({ text: this.dialogInput.successMessage, translateText: true });
    this.dialogRef.close(object);
  }
}
