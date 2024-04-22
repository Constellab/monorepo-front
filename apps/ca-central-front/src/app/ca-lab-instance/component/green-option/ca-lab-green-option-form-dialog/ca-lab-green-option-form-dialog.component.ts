import {Component, ComponentRef, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {
  FlDynamicFieldConfig,
  FlDynamicFormGroupComponent,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlFormHelper,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {
  CaLabGreenOption,
  CaLabGreenOptionFormDto,
  CaLabGreenOptionStopAfterInactivityValue,
  CaLabGreenOptionStopAfterTimeValue,
  CaLabGreenOptionType
} from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {MatRadioChange} from '@angular/material/radio';
import {ClDateHelper, ClHelpService} from '@monorepo/core-lib';

export interface CaLabGreenOptionFormDialogInput extends FlFormDialogInput<CaLabGreenOptionFormDto> {
  labInstanceId?: string; // create mode
  id?: string; // update mode
}

@Component({
  selector: 'ca-lab-green-option-form-dialog',
  templateUrl: './ca-lab-green-option-form-dialog.component.html',
  styleUrls: ['./ca-lab-green-option-form-dialog.component.scss'],
})
export class CaLabGreenOptionFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabGreenOptionFormDto, CaLabGreenOption>
  implements OnInit, OnDestroy {
  dialogInput: CaLabGreenOptionFormDialogInput = inject(MAT_DIALOG_DATA);

  greenOptionType: any = CaLabGreenOptionType;


  @ViewChild('subFormGroup', {static: true, read: ViewContainerRef}) viewContainer: ViewContainerRef;

  private viewComponentRef: ComponentRef<FlDynamicFormGroupComponent>;


  constructor(private labInstanceService: CaLabInstanceService,
              private translateService: FlTranslateService) {
    super();
  }

  ngOnInit(): void {
    this.init();

    if (this.isUpdateMode()) {
      this.buildSubForm(this.formGp.get('type').value, this.dialogInput.object.value);
    }
  }


  submit(): void {
    super.submit();

    if (this.formGp.invalid) {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  buildForm(): FormGroup<CaLabGreenOptionFormDto> {
    return new FormBuilder().group({
      type: [{value: null, disabled: this.isUpdateMode()}, Validators.required],
      value: [null],
      isPersistent: [null]
    });
  }

  onGreenOptionTypeChange(changeEvent: MatRadioChange): void {
    this.buildSubForm(changeEvent.value);

    this.forcePersistence(changeEvent.value);
  }

  private buildSubForm(type: CaLabGreenOptionType, value?: any): void {
    this.viewContainer.clear();
    this.viewComponentRef?.destroy();

    const formConfig: FlDynamicFormGroupConfig = {
      controlType: 'formGroup',
      subConfigs: this.getSubFormGroupConfig(type)
    };
    const defaultValue = value ?? this.getDefaultValue(type);
    // create the formGroup using the config
    const formGroup: FormGroup = FlDynamicFormHelper.generateFormGroup(formConfig, defaultValue) as FormGroup;

    // create the sub form group component if needed
    if (!ClHelpService.isNullOrEmpty(formConfig)) {
      this.viewComponentRef = this.viewContainer.createComponent(FlDynamicFormGroupComponent);

      this.viewComponentRef.instance.config = formConfig;
      this.viewComponentRef.instance.control = formGroup;
    }

    this.formGp.setControl('value', formGroup);
    this.formGp.updateValueAndValidity();
  }

  private getDefaultValue(type: CaLabGreenOptionType): any {
    switch (type) {
      case CaLabGreenOptionType.STOP_AFTER_TIME:
        return {
          hours: null,
          minutes: 0,
          timezone: ClDateHelper.getDate().zoneName,
          days: null,
        } as CaLabGreenOptionStopAfterTimeValue;
      case CaLabGreenOptionType.STOP_AFTER_INACTIVITY_TIME:
        return {
          inactivityDuration: null,
          days: null,
        } as CaLabGreenOptionStopAfterInactivityValue;
      default:
        return {};
    }
  }

  private forcePersistence(type: CaLabGreenOptionType): void {
    if (type === CaLabGreenOptionType.STOP_AFTER_EXPERIMENT || type === CaLabGreenOptionType.STOP_AFTER_BACKUP) {
      this.formGp.get('isPersistent').setValue(false);
      this.formGp.get('isPersistent').disable();
    } else {
      this.formGp.get('isPersistent').setValue(null);
      this.formGp.get('isPersistent').enable();
    }
  }

  private getSubFormGroupConfig(type: CaLabGreenOptionType): Record<string, FlDynamicFieldConfig> {
    switch (type) {
      case CaLabGreenOptionType.STOP_AFTER_TIME:
        return {
          hours: {
            controlType: 'formControl',
            type: 'input',
            placeholder: this.translateService.translate('lab_green_option_hour'),
            inputType: 'number',
            min: 0,
            max: 23,
            integer: true,
            required: true
          },
          minutes: {
            controlType: 'formControl',
            type: 'input',
            placeholder: this.translateService.translate('lab_green_option_minute'),
            inputType: 'number',
            min: 0,
            max: 60,
            integer: true,
            required: true
          },
          timezone: {
            controlType: 'formControl',
            type: 'input',
            placeholder: this.translateService.translate('lab_green_option_timezone'),
            inputType: 'text',
            disabled: true,
          }
        };
      case CaLabGreenOptionType.STOP_AFTER_INACTIVITY_TIME:
        return {
          inactivityDuration: {
            controlType: 'formControl',
            type: 'input',
            placeholder: this.translateService.translate('lab_green_option_inactivity_duration'),
            inputType: 'number',
            min: 0,
            max: 1000,
            integer: true,
            required: true
          }
        };
      default:
        return {};
    }
  }

  hasSubForm(): boolean {
    const group: FormGroup = this.formGp.get('value') as FormGroup;
    return !ClHelpService.isNullOrEmpty(group.controls);
  }

  create(formValue: CaLabGreenOptionFormDto): Observable<CaLabGreenOption> {
    return this.labInstanceService.createGreenOption(this.dialogInput.labInstanceId, formValue);
  }

  update(formValue: CaLabGreenOptionFormDto): Observable<CaLabGreenOption> {
    return this.labInstanceService.updateGreenOption(this.dialogInput.id, formValue);
  }


  get title(): string {
    return this.isCreateMode() ? 'lab_create_green_option' : 'lab_update_green_option';
  }

  getCreateSuccessMessage(): string {
    return 'lab_green_option_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_green_option_updated';
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
    this.viewComponentRef?.destroy();
  }


}

