import { Component, ComponentRef, inject, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
import {
  FlDynamicAbstractFormComponent,
  FlDynamicFormAbstractControl,
  FlDynamicFormArrayConfig,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlFormHelper,
} from '@monorepo/front-core-lib';
import {
  LabCredentials,
  LabCredentialsData,
  LabCredentialsDataBasic,
  LabCredentialsDataS3,
  LabCredentialsType,
  LabSaveCredentialsDTO,
} from '../../../../model/entities/lab-credentials.entity';
import { Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { catchError, map } from 'rxjs/operators';
import { LabCredentialsService } from '../../../../entity-service/lab-credentials.service';
import { MatSelectChange } from '@angular/material/select';

export interface LabCredentialsFormDialogInput extends FlFormDialogInput<LabSaveCredentialsDTO> {
  id?: string;
}

interface LabCredentialsOtherFormData {
  key: string;
  value: string;
}

@Component({
  selector: 'lab-credentials-form-dialog',
  templateUrl: './lab-credentials-form-dialog.component.html',
  styleUrls: ['./lab-credentials-form-dialog.component.scss'],
})
export class LabCredentialsFormDialogComponent
  extends FlFormDialogAbstractDirective<LabSaveCredentialsDTO, LabCredentials>
  implements OnInit
{
  dialogInput: LabCredentialsFormDialogInput = inject(MAT_DIALOG_DATA);

  sameNameExist$: Observable<boolean>;

  credentialsTypes: any = LabCredentialsType;

  // only provided in update mode
  private originalName: string;

  @ViewChild('subFormGroup', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private viewComponentRef: ComponentRef<FlDynamicAbstractFormComponent>;

  constructor(private credentialsService: LabCredentialsService) {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.originalName = this.dialogInput.object?.name;
    if (this.isUpdateMode()) {
      this.dialogInput.object.data = this.convertOtherToForm(
        this.dialogInput.object.type,
        this.dialogInput.object.data
      ) as any;
      this.buildDataForm(this.dialogInput.object.type, this.dialogInput.object.data);
    }
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      data: [{}, Validators.required],
      description: [null],
    });
  }

  onTypeChange(event: MatSelectChange): void {
    this.buildDataForm(event.value);
  }

  private buildDataForm(type: LabCredentialsType, defaultValue?: any): void {
    this.viewContainer.clear();
    this.viewComponentRef?.destroy();

    const formConfig: FlDynamicFormAbstractControl = this.getDataFormGroupConfig(type);

    // create the formGroup using the config
    const control: AbstractControl = FlDynamicFormHelper.generateForm(formConfig, defaultValue);

    // create the sub form group component if needed
    this.viewComponentRef = this.viewContainer.createComponent(FlDynamicAbstractFormComponent);

    this.viewComponentRef.instance.config = signal<FlDynamicFormAbstractControl>(formConfig) as any;
    this.viewComponentRef.instance.control = signal<AbstractControl>(control) as any;

    this.formGp.setControl('data', control as any);
    this.formGp.updateValueAndValidity();
  }

  submit(): void {
    FlFormHelper.markAllAsTouched(this.formGp);
    super.submit();
  }

  create(formValue: LabSaveCredentialsDTO): Observable<LabCredentials> {
    if (formValue.type === LabCredentialsType.OTHER) {
      formValue.data = this.convertOtherFromForm(formValue.type, formValue.data as any);
    }
    return this.credentialsService.create(formValue);
  }

  update(formValue: LabSaveCredentialsDTO): Observable<LabCredentials> {
    if (formValue.type === LabCredentialsType.OTHER) {
      formValue.data = this.convertOtherFromForm(formValue.type, formValue.data as any);
    }
    return this.credentialsService.update(this.dialogInput.id, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_credentials' : 'biox.update_credentials';
  }

  getCreateSuccessMessage(): string {
    return 'biox.credentials_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.credentials_updated';
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

  private getDataFormGroupConfig(type: LabCredentialsType): FlDynamicFormAbstractControl {
    switch (type) {
      case LabCredentialsType.S3:
        return this.getS3FormGroupConfig();
      case LabCredentialsType.BASIC:
        return this.getBasicFormGroupConfig();
      case LabCredentialsType.OTHER:
        return this.getOtherFormArrayConfig();
      default:
        return {
          controlType: 'formGroup',
          subConfigs: {},
        };
    }
  }

  private getS3FormGroupConfig(): FlDynamicFormGroupConfig {
    return {
      controlType: 'formGroup',
      subConfigs: {
        endpoint_url: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Endpoint url',
          inputType: 'text',
          required: true,
        },
        region: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Region',
          inputType: 'text',
          required: true,
        },
        access_key_id: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Access key id',
          inputType: 'text',
          required: true,
        },
        secret_access_key: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Secret access key',
          inputType: 'text',
          required: true,
        },
        bucket: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Bucket name',
          inputType: 'text',
        },
      } as Record<keyof LabCredentialsDataS3, FlDynamicFormAbstractControl>,
    };
  }

  private getBasicFormGroupConfig(): FlDynamicFormGroupConfig {
    return {
      controlType: 'formGroup',
      subConfigs: {
        username: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Username',
          inputType: 'text',
          required: true,
        },
        password: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'Password',
          inputType: 'text',
          required: true,
        },
        url: {
          controlType: 'formControl',
          type: 'input',
          placeholder: 'URL',
          inputType: 'text',
        },
      } as Record<keyof LabCredentialsDataBasic, FlDynamicFormAbstractControl>,
    };
  }

  private getOtherFormArrayConfig(): FlDynamicFormArrayConfig {
    return {
      controlType: 'formArray',
      minSize: 1,
      formGpConfig: {
        controlType: 'formGroup',
        subConfigs: {
          key: {
            controlType: 'formControl',
            type: 'input',
            placeholder: 'Key',
            inputType: 'text',
            required: true,
          },
          value: {
            controlType: 'formControl',
            type: 'input',
            placeholder: 'Value',
            inputType: 'text',
            required: true,
          },
        },
      },
    };
  }

  private convertOtherFromForm(type: LabCredentialsType, dataFormValue: any): LabCredentialsData {
    // only modify if type is other
    if (type !== LabCredentialsType.OTHER) return dataFormValue;

    const otherValue: LabCredentialsOtherFormData[] = dataFormValue;
    const result: Record<string, string> = {};
    otherValue.forEach((item) => {
      result[item.key] = item.value;
    });
    return result;
  }

  private convertOtherToForm(type: LabCredentialsType, data: LabCredentialsData): any {
    // only modify if type is other
    if (type !== LabCredentialsType.OTHER) return data;
    const result: LabCredentialsOtherFormData[] = [];
    Object.keys(data).forEach((key) => {
      result.push({ key, value: data[key] });
    });
    return result;
  }
}
