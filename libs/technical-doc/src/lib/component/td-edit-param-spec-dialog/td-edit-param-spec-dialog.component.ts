import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  TdConfig,
  TdParamSpec,
  TdParamSpecFormInfoList,
  TdParamSpecString,
  TdParamSpecType,
} from '../../model/td-config-spec.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TdParamSpecConfig } from '../../model/td-param-spec-config.class';
import {
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigSelect,
  FlDynamicFieldSelectKeyNameOption,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';

export interface TdEditParamSpecDialogInput {
  configSpecName: string;
  paramSpecFormInfoList$: Observable<TdParamSpecFormInfoList>;
  spec?: TdParamSpec;
  name?: string;
}

@Component({
  selector: 'td-edit-param-spec-dialog',
  templateUrl: './td-edit-param-spec-dialog.component.html',
  styleUrl: './td-edit-param-spec-dialog.component.scss',
})
export class TdEditParamSpecDialogComponent implements OnInit {
  formGroupConfig: FlDynamicFormGroupConfig;

  formGroup: UntypedFormGroup;

  isEdit: boolean;

  private spec: TdParamSpec;

  private name: string;

  private paramSpecConfig: TdParamSpecConfig;

  private possibleTypes: FlDynamicFieldSelectKeyNameOption[] = [];

  private paramSpecFormInfoList$: Observable<TdParamSpecFormInfoList>;

  private configSpecName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: TdEditParamSpecDialogInput,
    private translateService: FlTranslateService,
    private dialogRef: MatDialogRef<TdEditParamSpecDialogComponent>,
    private dynamicParamSpecState: TdAbstractDynamicParamSpecState
  ) {
    this.paramSpecFormInfoList$ = data.paramSpecFormInfoList$;
    this.configSpecName = data.configSpecName;

    if (!data.spec) {
      this.isEdit = false;
      this.spec = {
        type: 'str',
        optional: false,
        visibility: 'public',
      } as TdParamSpecString;
    } else {
      this.isEdit = true;
      this.spec = data.spec;
      this.name = data.name;
    }
  }

  ngOnInit(): void {
    this.paramSpecFormInfoList$.subscribe((paramSpecFormInfoList: TdParamSpecFormInfoList) => {
      for (const paramSpecInfo of Object.keys(paramSpecFormInfoList)) {
        const humanName: string = paramSpecFormInfoList[paramSpecInfo]['human_name'] as any;
        this.possibleTypes.push({ key: paramSpecInfo as TdParamSpecType, humanName: humanName });
        delete paramSpecFormInfoList[paramSpecInfo]['human_name'];
      }
      this.paramSpecConfig = new TdParamSpecConfig(paramSpecFormInfoList);
      this.initForm();
    });
  }

  saveParamSpec(): void {
    if (this.formGroup.valid) {
      if (this.isEdit) {
        const oldName = this.name != this.formGroup.get('name').value ? this.name : null;
        if (oldName) {
          this.dynamicParamSpecState
            .renameAndEditParamSpec(
              this.configSpecName,
              oldName,
              this.formGroup.get('name').value,
              this.formGroup.value
            )
            .subscribe((config: TdConfig) => this.dialogRef.close(config));
        } else {
          this.dynamicParamSpecState
            .editParamSpec(this.configSpecName, this.formGroup.get('name').value, this.formGroup.value)
            .subscribe((config: TdConfig) => this.dialogRef.close(config));
        }
      } else {
        this.dynamicParamSpecState
          .addParamSpec(this.configSpecName, this.formGroup.get('name').value, this.formGroup.value)
          .subscribe((config: TdConfig) => this.dialogRef.close(config));
      }
    }
  }

  private initForm(): void {
    this.formGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {},
    };
    this.formGroupConfig.subConfigs['type'] = this.getTypeDynamicFieldConfigSelect();
    this.formGroupConfig.subConfigs['name'] = this.getNameDynamicFieldConfigInput();
    this.initCompleteForm();
  }

  private initCompleteForm(): void {
    this.formGroupConfig.subConfigs = Object.assign(
      {},
      this.formGroupConfig.subConfigs,
      this.paramSpecConfig.getDynamicFormFieldsConfig(this.spec?.type ?? 'str').subConfigs
    );
    this.formGroup = FlDynamicFormHelper.generateFormGroup(this.formGroupConfig, this.spec);
    this.formGroup.patchValue(this.spec);
    this.formGroup.get('name').patchValue(this.name ?? '');
    this.formGroup.get('type').valueChanges.subscribe((type: TdParamSpecType) => {
      this.spec.type = type as any;
      this.spec.default_value = null;
      this.initForm();
    });
  }

  private getNameDynamicFieldConfigInput(): FlDynamicFieldConfigInput {
    return {
      inputType: 'text',
      type: 'input',
      placeholder: this.translateService.translate('td.name'),
      controlType: 'formControl',
      required: true,
    };
  }

  private getTypeDynamicFieldConfigSelect(): FlDynamicFieldConfigSelect {
    return {
      type: 'select',
      selectOptions: signal(this.possibleTypes),
      controlType: 'formControl',
      placeholder: this.translateService.translate('td.type'),
      required: true,
    };
  }
}
