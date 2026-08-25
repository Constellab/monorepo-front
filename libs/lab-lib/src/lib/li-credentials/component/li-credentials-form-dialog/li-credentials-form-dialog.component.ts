import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectTrigger } from '@angular/material/select';
import { ClHelpService } from '@monorepo/core-lib';
import { FlFormDialogInput, FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlDynamicFieldModule,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  LiCredentials,
  LiCredentialsDataSpecs,
  LiCredentialsDataTypeSpec,
  LiSaveCredentialsDTO,
} from '@monorepo/lab-lib/li-core';
import { TdConfig } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LiCredentialsService } from '../../service/li-credentials.service';

export interface LiCredentialsFormDialogInput extends FlFormDialogInput<LiSaveCredentialsDTO> {
  id?: string;
}

@Component({
  selector: 'li-credentials-form-dialog',
  templateUrl: './li-credentials-form-dialog.component.html',
  styleUrls: ['./li-credentials-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatHint,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    FlDynamicFieldModule,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiCredentialsFormDialogComponent implements OnInit {
  dialogInput: LiCredentialsFormDialogInput = inject(MAT_DIALOG_DATA);

  sameNameExist$: Observable<boolean>;

  dataSpecs: LiCredentialsDataTypeSpec[] = [];

  isLoading: boolean = false;

  formGp: UntypedFormGroup;
  dataConfig: FlDynamicFormAbstractControl | null;

  // only provided in update mode
  private originalName: string | undefined;

  private credentialsService = inject(LiCredentialsService);
  private snackBarService = inject(FlSnackBarService);
  private dialogRef = inject(MatDialogRef);

  private specs: LiCredentialsDataSpecs;

  ngOnInit(): void {
    this.originalName = this.dialogInput.object?.name;
    this.buildForm();
    if (this.isUpdateMode() && this.dialogInput.object) {
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

  private getSpecsSuccess(specs: LiCredentialsDataSpecs): void {
    this.specs = specs;
    this.dataSpecs = specs.dataSpecs;
    const typeControl = this.formGp.get('type');
    if (typeControl?.value) {
      this.buildDataForm(specs, typeControl.value, this.dialogInput.object?.data);
    }
  }

  getTypeHumanName(type: string | undefined): string {
    return this.dataSpecs.find((s) => s.type === type)?.humanName ?? type ?? '';
  }

  // 'data' control is always present (set in buildForm/buildDataForm); the fallback FormControl()
  // is a stopgap for fl-dynamic-abstract-form's `control` input, which is typed as non-nullable
  // AbstractControl (owned by front-core-lib).
  getDataControl(): AbstractControl {
    return this.formGp.get('data') ?? new FormControl();
  }

  onTypeChange(event: MatSelectChange): void {
    if (this.specs) {
      this.buildDataForm(this.specs, event.value, null);
    }
  }

  private buildDataForm(specs: LiCredentialsDataSpecs, type: string, defaultValue: any): void {
    this.dataConfig = null;

    if (!type) return;

    const spec = specs.dataSpecs.find((s) => s.type === type);
    if (!spec) {
      throw new Error(`[LiCredentialsFormDialogComponent] No spec found for type ${type}`);
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

  create(formValue: LiSaveCredentialsDTO): void {
    this.credentialsService.create(formValue).subscribe({
      next: (credentials) => this.onCreateSuccess(credentials),
      error: () => (this.isLoading = false),
    });
  }

  private onCreateSuccess(credentials: LiCredentials): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage('li.credentials_created');
    this.dialogRef.close(credentials);
  }

  update(formValue: LiSaveCredentialsDTO): void {
    const id = this.dialogInput.id;
    if (!id) return;

    this.credentialsService.update(id, formValue).subscribe({
      next: (credentials) => this.onUpdateSuccess(credentials),
      error: () => (this.isLoading = false),
    });
  }

  private onUpdateSuccess(credentials: LiCredentials): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage('li.credentials_created');
    this.dialogRef.close(credentials);
  }

  get title(): string {
    return this.isCreateMode() ? 'li.create_credentials' : 'li.update_credentials';
  }

  onNameChange(): void {
    const name = this.formGp.get('name')?.value;

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
    spec: LiCredentialsDataTypeSpec,
    defaultValue?: any
  ): FlDynamicFormGroupConfig {
    const labConfig = TdConfig.fromSpecs(spec.specs, defaultValue);
    return labConfig.getDynamicFormFieldsConfig();
  }
}
