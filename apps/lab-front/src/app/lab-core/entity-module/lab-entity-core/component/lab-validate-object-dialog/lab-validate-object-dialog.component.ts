import { Component, OnInit, inject } from '@angular/core';
import { LabFolder } from '../../../../model/entities/lab-folder.class';
import { Observable } from 'rxjs';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LabEntity } from '../../../../model/global/lab-entity.entity';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabFolderSelectComponent } from '../../../lab-folder-core/component/lab-folder-select/lab-folder-select.component';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    LabFolderSelectComponent,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabValidateObjectDialogComponent implements OnInit {
  private dialogInput = inject<LabValidateObjectDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LabValidateObjectDialogComponent>>(MatDialogRef);
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
