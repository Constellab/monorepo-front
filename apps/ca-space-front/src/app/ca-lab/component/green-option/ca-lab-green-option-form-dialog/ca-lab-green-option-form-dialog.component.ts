import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioChange, MatRadioGroup } from '@angular/material/radio';
import { ClDateHelper, ClHelpService } from '@monorepo/core-lib';
import { FlFormDialogInput, FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlDynamicFieldConfig,
  FlDynamicFieldModule,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlRadioButtonBigModule } from '@monorepo/front-core-lib/fl-radio-button-big';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  CaLabGreenOption,
  CaLabGreenOptionFormDto,
  CaLabGreenOptionStopAfterInactivityValue,
  CaLabGreenOptionStopAfterTimeValue,
  CaLabGreenOptionType,
} from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

export interface CaLabGreenOptionFormDialogInput extends FlFormDialogInput<CaLabGreenOptionFormDto> {
  labId?: string; // create mode
  id?: string; // update mode
}

@Component({
  selector: 'ca-lab-green-option-form-dialog',
  templateUrl: './ca-lab-green-option-form-dialog.component.html',
  styleUrls: ['./ca-lab-green-option-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    FlRadioButtonBigModule,
    FlTextIconModule,
    MatIcon,
    FlDynamicFieldModule,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabGreenOptionFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabGreenOptionFormDto, CaLabGreenOption>
  implements OnInit
{
  dialogInput: CaLabGreenOptionFormDialogInput = inject(MAT_DIALOG_DATA);

  greenOptionType: any = CaLabGreenOptionType;

  warningText: string = null;

  subFormConfig: FlDynamicFormGroupConfig;
  subFormGroup: UntypedFormGroup;

  private labService = inject(CaLabService);
  private translateService = inject(FlTranslateService);

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

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      type: [{ value: null, disabled: this.isUpdateMode() }, Validators.required],
      value: [null],
      isPersistent: [null],
    });
  }

  onGreenOptionTypeChange(changeEvent: MatRadioChange): void {
    this.buildSubForm(changeEvent.value);

    this.forcePersistence(changeEvent.value);

    if (changeEvent.value === CaLabGreenOptionType.STOP_AFTER_INACTIVITY_TIME) {
      this.warningText = 'lab_green_option_STOP_AFTER_INACTIVITY_TIME_warnings';
    } else {
      this.warningText = null;
    }
  }

  private buildSubForm(type: CaLabGreenOptionType, value?: any): void {
    this.subFormConfig = {
      controlType: 'formGroup',
      subConfigs: this.getSubFormGroupConfig(type),
    };
    const defaultValue = value ?? this.getDefaultValue(type);
    // create the formGroup using the config
    this.subFormGroup = FlDynamicFormHelper.generateFormGroup(this.subFormConfig, defaultValue);

    this.formGp.setControl('value', this.subFormGroup);
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
    if (
      type === CaLabGreenOptionType.STOP_AFTER_SCENARIO ||
      type === CaLabGreenOptionType.STOP_AFTER_BACKUP
    ) {
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
            required: true,
          },
          minutes: {
            controlType: 'formControl',
            type: 'input',
            placeholder: this.translateService.translate('lab_green_option_minute'),
            inputType: 'number',
            min: 0,
            max: 60,
            integer: true,
            required: true,
          },
          timezone: {
            controlType: 'formControl',
            type: 'input',
            placeholder: this.translateService.translate('lab_green_option_timezone'),
            inputType: 'text',
            disabled: true,
          },
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
            required: true,
          },
        };
      default:
        return {};
    }
  }

  hasSubForm(): boolean {
    const group: UntypedFormGroup = this.formGp.get('value') as UntypedFormGroup;
    return !ClHelpService.isNullOrEmpty(group.controls);
  }

  create(formValue: CaLabGreenOptionFormDto): Observable<CaLabGreenOption> {
    return this.labService.createGreenOption(this.dialogInput.labId, formValue);
  }

  update(formValue: CaLabGreenOptionFormDto): Observable<CaLabGreenOption> {
    return this.labService.updateGreenOption(this.dialogInput.id, formValue);
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
}
