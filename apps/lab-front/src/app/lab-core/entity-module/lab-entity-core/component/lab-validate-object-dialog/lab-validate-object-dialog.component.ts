import { Component, Inject, OnInit } from '@angular/core';
import { LabFolder } from '../../../../model/entities/lab-folder.class';
import { Observable } from 'rxjs';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { FormControl, Validators } from '@angular/forms';
import { LabEntity } from '../../../../model/global/lab-entity.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface LabValidateObjectDialogInput {
  title: string;

  helpText?: string;

  validate(folder: LabFolder): Observable<any>;

  successMessage: string;

  folder?: LabEntity;
}

/**
 * Generic dialog to validate an object by selecting a folder.
 * This works for scenarios and notes
 */
@Component({
  selector: 'lab-validate-object-dialog',
  templateUrl: './lab-validate-object-dialog.component.html',
  styleUrls: ['./lab-validate-object-dialog.component.scss'],
})
export class LabValidateObjectDialogComponent implements OnInit {
  title: string;
  helpText: string;

  formControl: FormControl;

  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogInput: LabValidateObjectDialogInput,
    private dialogRef: MatDialogRef<LabValidateObjectDialogComponent>,
    private snackBarService: FlSnackBarService
  ) {
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

  private validateObject(folder: LabFolder): void {
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
