import { Component, inject, OnInit } from '@angular/core';
import {
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
  FlFormDialogInput,
  FlFormHelper,
  FlSnackBarService,
} from '@monorepo/front-core-lib';
import {
  LabCredentials,
  LabCredentialsDataSpecs,
  LabCredentialsDataTypeSpec,
  LabCredentialsType,
  LabSaveCredentialsDTO,
} from '../../../../model/entities/lab-credentials.entity';
import { Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { catchError, map } from 'rxjs/operators';
import { LabCredentialsService } from '../../../../entity-service/lab-credentials.service';
import { MatSelectChange } from '@angular/material/select';
import { LabConfig } from '../../../../model/entities/lab-config.entity';

export interface LabCredentialsFormDialogInput extends FlFormDialogInput<LabSaveCredentialsDTO> {
  id?: string;
}

@Component({
    selector: 'lab-credentials-form-dialog',
    templateUrl: './lab-credentials-form-dialog.component.html',
    styleUrls: ['./lab-credentials-form-dialog.component.scss'],
    standalone: false
})
export class LabCredentialsFormDialogComponent implements OnInit {
  dialogInput: LabCredentialsFormDialogInput = inject(MAT_DIALOG_DATA);

  sameNameExist$: Observable<boolean>;

  credentialsTypes: any = LabCredentialsType;

  isLoading: boolean = false;

  formGp: UntypedFormGroup;
  dataConfig: FlDynamicFormAbstractControl;

  // only provided in update mode
  private originalName: string;

  private credentialsService = inject(LabCredentialsService);
  private snackBarService = inject(FlSnackBarService);
  private dialogRef = inject(MatDialogRef);

  private specs: LabCredentialsDataSpecs;

  ngOnInit(): void {
    this.originalName = this.dialogInput.object?.name;
    this.buildForm();
    if (this.isUpdateMode()) {
      this.formGp.patchValue(this.dialogInput.object);
    }
    this.getSpecs();
  }

  private buildForm(): void {
    this.formGp = new FormBuilder().group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      data: null,
      description: [null],
    });
  }

  private getSpecs(): void {
    this.credentialsService.getCredentialsDataSpecs().subscribe({
      next: (specs) => this.getSpecsSuccess(specs),
    });
  }

  private getSpecsSuccess(specs: LabCredentialsDataSpecs): void {
    this.specs = specs;
    if (this.formGp.get('type').value) {
      this.buildDataForm(specs, this.formGp.get('type').value, this.dialogInput.object?.data);
    }
  }

  onTypeChange(event: MatSelectChange): void {
    if (this.specs) {
      this.buildDataForm(this.specs, event.value, null);
    }
  }

  private buildDataForm(specs: LabCredentialsDataSpecs, type: LabCredentialsType, defaultValue: any): void {
    this.dataConfig = null;

    if (!type) return;

    const spec = specs.dataSpecs.find((s) => s.type === type);
    if (!spec) {
      throw new Error(`[LabCredentialsFormDialogComponent] No spec found for type ${type}`);
    }
    this.dataConfig = this.getDataFormGroupConfig(spec, defaultValue);

    // create the formGroup using the config
    const control: AbstractControl = FlDynamicFormHelper.generateFormGroup(this.dataConfig, defaultValue);

    this.formGp.setControl('data', control as any);
    this.formGp.updateValueAndValidity();
  }

  submit(): void {
    FlFormHelper.markAllAsTouched(this.formGp);
    if (!this.formGp.valid || this.isLoading) return;

    this.isLoading = true;
    if (this.isCreateMode()) {
      this.create(this.formGp.getRawValue());
    } else {
      this.update(this.formGp.getRawValue());
    }
  }

  create(formValue: LabSaveCredentialsDTO): void {
    this.credentialsService.create(formValue).subscribe({
      next: (credentials) => this.onCreateSuccess(credentials),
      error: () => (this.isLoading = false),
    });
  }

  private onCreateSuccess(credentials: LabCredentials): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage('biox.credentials_created');
    this.dialogRef.close(credentials);
  }

  update(formValue: LabSaveCredentialsDTO): void {
    this.credentialsService.update(this.dialogInput.id, formValue).subscribe({
      next: (credentials) => this.onUpdateSuccess(credentials),
      error: () => (this.isLoading = false),
    });
  }

  private onUpdateSuccess(credentials: LabCredentials): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage('biox.credentials_created');
    this.dialogRef.close(credentials);
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_credentials' : 'biox.update_credentials';
  }

  onNameChange(): void {
    const name = this.formGp.get('name').value;

    if (ClHelpService.isNullOrEmpty(name) || name === this.originalName) {
      this.sameNameExist$ = of(false);
    } else {
      this.sameNameExist$ = this.credentialsService.findByName(name).pipe(
        map((result) => result != null),
        catchError(() => of(false))
      );
    }
  }

  isCreateMode(): boolean {
    return this.dialogInput.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.dialogInput.mode === 'update';
  }

  private getDataFormGroupConfig(
    spec: LabCredentialsDataTypeSpec,
    defaultValue?: any
  ): FlDynamicFormGroupConfig {
    const labConfig = LabConfig.fromSpecs(spec.specs, defaultValue);
    return labConfig.getDynamicFormFieldsConfig();
  }
}
