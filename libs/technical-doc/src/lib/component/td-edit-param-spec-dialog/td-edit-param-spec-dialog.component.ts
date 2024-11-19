import { Component, Inject, OnInit } from '@angular/core';
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
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';

export interface TdEditParamSpecDialogInput {
  paramSpecFormInfoList$: Observable<TdParamSpecFormInfoList>;
  dynamicParamSpecState: TdAbstractDynamicParamSpecState;
  spec?: TdParamSpec;
  name?: string;
}

@Component({
  selector: 'td-edit-param-spec-dialog',
  templateUrl: './td-edit-param-spec-dialog.component.html',
  styleUrl: './td-edit-param-spec-dialog.component.scss',
})
export class TdEditParamSpecDialogComponent implements OnInit {
  spec: TdParamSpec;
  name: string;
  paramSpecFormInfoList$: Observable<TdParamSpecFormInfoList>;
  paramSpecFormInfoList: TdParamSpecFormInfoList;

  formGroupConfig: FlDynamicFormGroupConfig;
  formGroup: UntypedFormGroup;

  paramSpecConfig: TdParamSpecConfig;

  possibleTypes: TdParamSpecType[];

  isEdit: boolean;

  dynamicParamSpecState: TdAbstractDynamicParamSpecState;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: TdEditParamSpecDialogInput,
    private translateService: FlTranslateService,
    private dialogRef: MatDialogRef<TdEditParamSpecDialogComponent>
  ) {
    this.dynamicParamSpecState = data.dynamicParamSpecState;
    this.paramSpecFormInfoList$ = data.paramSpecFormInfoList$;

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
      this.paramSpecFormInfoList = paramSpecFormInfoList;
      this.possibleTypes = Object.keys(paramSpecFormInfoList) as TdParamSpecType[];
      this.paramSpecConfig = new TdParamSpecConfig(this.paramSpecFormInfoList, this.translateService);
      this.initForm();
    });
  }

  saveParamSpec(): void {
    if (this.formGroup.valid) {
      if (this.isEdit) {
        const oldName = this.name != this.formGroup.get('name').value ? this.name : null;
        if (oldName) {
          this.dynamicParamSpecState
            .renameAndEditParamSpec(oldName, this.formGroup.get('name').value, this.formGroup.value)
            .subscribe((config: TdConfig) => this.dialogRef.close(config));
        } else {
          this.dynamicParamSpecState
            .editParamSpec(this.formGroup.get('name').value, this.formGroup.value)
            .subscribe((config: TdConfig) => this.dialogRef.close(config));
        }
      } else {
        this.dynamicParamSpecState
          .addParamSpec(this.formGroup.get('name').value, this.formGroup.value)
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
      selectOptions: this.possibleTypes,
      controlType: 'formControl',
      placeholder: this.translateService.translate('td.type'),
      required: true,
    };
  }
}
