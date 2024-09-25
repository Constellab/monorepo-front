import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FlConfirmDialogInput, FlConfirmDialogResult } from '../../model/fl-confirm-dialog.class';
import { FlSnackBarService } from '../../../fl-snack-bar/fl-snack-bar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { FlGlobalValidators } from '../../../../utils/fl-global.validators';

@Component({
  selector: 'fl-confirm-dialog',
  templateUrl: './fl-confirm-dialog.component.html',
  styleUrls: ['./fl-confirm-dialog.component.scss']
})
export class FlConfirmDialogComponent implements OnInit {

  inputData: FlConfirmDialogInput;

  confirmTextFormControl: FormControl;

  // true if the observable is loading
  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) inputData: FlConfirmDialogInput,
              private dialogRef: MatDialogRef<FlConfirmDialogComponent>,
              private snackBarService: FlSnackBarService) {
    this.inputData = inputData;

    if (inputData.confirmWithText) {
      this.confirmTextFormControl = new FormControl('', [Validators.required, FlGlobalValidators.isValue(inputData.confirmWithText)]);
    }
  }

  ngOnInit(): void {
    // catch the backdrop click to handle the closing and the object send back
    this.dialogRef.backdropClick()
      .subscribe(() => this.onBackdropClick());
  }

  private onBackdropClick(): void {
    // if the dialog is loading, prevent closing
    if (this.isLoading) {
      return;
    }

    this.closeDialog(false);
  }

  closeDialog(choice: boolean): void {
    if (this.isLoading) {
      return;
    }

    if (choice && this.confirmTextFormControl && this.confirmTextFormControl.invalid) {
      this.confirmTextFormControl.markAllAsTouched();
      return;
    }

    // if there is an observable and the choice is true
    // --> call the observable
    if (this.inputData.observable && choice) {
      this.subscribeObservable(this.inputData.observable);
    }
    // otherwise, return the choice with a null result
    else {
      if (choice && this.inputData.successMessage) {
        this.snackBarService.openSuccessMessage(this.inputData.successMessage);
      }

      const response: FlConfirmDialogResult = {
        result: null,
        choice: choice
      };
      this.dialogRef.close(response);
    }
  }

  // subscribe to the observable
  private subscribeObservable(observable: Observable<any>): void {
    this.isLoading = true;
    observable.subscribe({
      next: result => this.success(result),
      error: () => this.err()
    });
  }

  // on observable success
  private success(result: any): void {
    if (this.inputData.successMessage) {
      this.snackBarService.openSuccessMessage(this.inputData.successMessage);
    }

    // return the result and close the dialog
    const response: FlConfirmDialogResult = {
      result: result,
      choice: true
    };
    this.dialogRef.close(response);

    this.isLoading = false;

  }

  // on observable error, hide the loading
  private err(): void {
    this.isLoading = false;
  }
}

