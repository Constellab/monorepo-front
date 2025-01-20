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
import { ClStringHelper } from '@monorepo/core-lib';

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
    standalone: false
})
export class TdEditParamSpecDialogComponent implements OnInit {
  formGroupConfig: FlDynamicFormGroupConfig;

  formGroup: UntypedFormGroup;

  isEdit: boolean;

  isLoading: boolean;

  private spec: TdParamSpec;

  private name: string;

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
      // Set default values for the new param spec if it's create mode
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
    this.isLoading = true;

    // Subscribe to the paramSpecFormInfoList$ observable to get the possible types from the python backend
    // Then init the form with the current type of the spec if it exists, otherwise the default type is 'str'
    this.paramSpecFormInfoList$.subscribe({
      next: (paramSpecFormInfoList: TdParamSpecFormInfoList) => {
        for (const paramSpecInfo of Object.keys(paramSpecFormInfoList)) {
          const humanName: string = ClStringHelper.snakeCaseToSentence(paramSpecInfo);
          this.possibleTypes.push({ key: paramSpecInfo as TdParamSpecType, humanName: humanName });
          delete paramSpecFormInfoList[paramSpecInfo]['human_name'];
        }
        if (paramSpecFormInfoList[this.spec.type]) {
          this.initForm(this.spec.type, paramSpecFormInfoList);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  saveParamSpec(): void {
    if (this.formGroup.valid) {
      if (this.isEdit) {
        const oldName = this.name != this.formGroup.get('name').value ? this.name : null;
        if (oldName) {
          // Call rename and edit the param spec if the name field is changed and it's update mode
          this.dynamicParamSpecState
            .renameAndEditParamSpec(
              this.configSpecName,
              oldName,
              this.formGroup.get('name').value,
              this.formGroup.value
            )
            .subscribe((config: TdConfig) => this.dialogRef.close(config));
        } else {
          // Edit the param spec if the name field is not changed and it's update mode
          this.dynamicParamSpecState
            .editParamSpec(this.configSpecName, this.formGroup.get('name').value, this.formGroup.value)
            .subscribe((config: TdConfig) => this.dialogRef.close(config));
        }
      } else {
        // Create the param spec if it's create mode
        this.dynamicParamSpecState
          .addParamSpec(this.configSpecName, this.formGroup.get('name').value, this.formGroup.value)
          .subscribe((config: TdConfig) => this.dialogRef.close(config));
      }
    }
  }

  // Create the form group config and add the type and
  // name fields because they are always present and not in the specsInfoList
  // Then call initCompleteForm to add the other fields based on the type selected
  private initForm(type: string, specsInfoList: TdParamSpecFormInfoList): void {
    this.formGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {},
    };
    this.formGroupConfig.subConfigs['type'] = this.getTypeDynamicFieldConfigSelect();
    this.formGroupConfig.subConfigs['name'] = this.getNameDynamicFieldConfigInput();

    this.initCompleteForm(type, specsInfoList);
  }

  // Add the fields based on the type selected and the info in the specsInfoList to the form group config
  private initCompleteForm(type: string, specsInfoList: TdParamSpecFormInfoList): void {
    this.formGroupConfig.subConfigs = Object.assign(
      {},
      this.formGroupConfig.subConfigs,
      TdParamSpecConfig.convertToFieldConfigsRecursive(specsInfoList[type]).subConfigs
    );
    this.formGroup = FlDynamicFormHelper.generateFormGroup(this.formGroupConfig, this.spec);
    this.formGroup.patchValue(this.spec);
    this.formGroup.get('name').patchValue(this.name ?? '');
    this.formGroup.get('type').valueChanges.subscribe((type: TdParamSpecType) => {
      this.spec.type = type as any;
      this.spec.default_value = null;
      this.initForm(type, specsInfoList);
    });
  }

  // Return a basic form control config for the name field
  private getNameDynamicFieldConfigInput(): FlDynamicFieldConfigInput {
    return {
      inputType: 'text',
      type: 'input',
      placeholder: this.translateService.translate('td.name'),
      controlType: 'formControl',
      required: true,
    };
  }

  // Return the form control config for the type field with all possible types as options
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
