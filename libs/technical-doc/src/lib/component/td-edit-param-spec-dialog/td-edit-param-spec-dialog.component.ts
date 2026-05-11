import { Component, inject, OnDestroy, signal, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlDynamicFieldSelectKeyNameOption,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  TdParamSpec,
  TdParamSpecCategory,
  TdParamSpecEntry,
  TdParamSpecs,
  TdParamSpecSimple,
  TdParamSpecType,
  TdParamSpecTypeEnum,
} from '../../model/td-config-spec.class';
import { TdParamSpecConfig } from '../../model/td-param-spec-config.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';
import { TdLocalParamSpecState } from '../../service/td-local-param-spec.state';

export interface TdParamSpecInfo {
  type: TdParamSpecType;
  category: TdParamSpecCategory;
  additional_info: Record<string, TdParamSpecSimple> | null;
}

export interface TdEditParamSpecDialogInput {
  paramSpecFormInfoList$: Observable<TdParamSpecInfo[]>;
  dynamicParamSpecState: TdAbstractDynamicParamSpecState;
  /**
   * Provided if mode is update, null if create
   */
  paramSpec?: TdParamSpecEntry;
  title: FlTranslatableText;
  saveButtonText?: FlTranslatableText;
}

@Component({
  selector: 'td-edit-param-spec-dialog',
  templateUrl: './td-edit-param-spec-dialog.component.html',
  styleUrl: './td-edit-param-spec-dialog.component.scss',
  standalone: false,
})
export class TdEditParamSpecDialogComponent implements OnDestroy {
  private dialogRef = inject<MatDialogRef<TdEditParamSpecDialogComponent>>(MatDialogRef);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private translateService = inject(FlTranslateService);

  readonly isLoading = signal(true);
  readonly isButtonLoading = signal(false);
  readonly groupedTypes = signal<{ category: string; options: FlDynamicFieldSelectKeyNameOption[] }[]>([]);
  readonly isParamSetType = signal(false);

  formGroup: FormGroup;
  readonly formId = `paramSpecForm_${Math.random().toString(36).slice(2, 8)}`;
  additionalInfoFormGroupConfig = signal<FlDynamicFormGroupConfig | null>(null);
  localParamSpecState: TdLocalParamSpecState | null = null;

  data = inject<TdEditParamSpecDialogInput>(MAT_DIALOG_DATA);

  private paramSpecInfoList: TdParamSpecInfo[] = [];
  private labelManuallyEdited = false;
  private subscriptions = new ClSubscriptionHandler();

  constructor() {
    const data = inject<TdEditParamSpecDialogInput>(MAT_DIALOG_DATA);

    this.subscriptions.add(
      data.paramSpecFormInfoList$.subscribe({
        next: (list) => this.onParamSpecInfoLoaded(list),
        error: () => this.isLoading.set(false),
      })
    );
  }

  onTypeChange(type: TdParamSpecType): void {
    this.formGroup.get('default_value').reset(null);
    this.isParamSetType.set(type === TdParamSpecTypeEnum.PARAM_SET);
    this.buildAdditionalInfoForm(type);

    if (type === TdParamSpecTypeEnum.PARAM_SET) {
      this.initLocalParamSpecState();
    } else {
      this.localParamSpecState = null;
    }
  }

  saveParamSpec(): void {
    if (this.formGroup.invalid) return;

    this.isButtonLoading.set(true);
    const paramSpec = this.buildParamSpecFromForm();
    const key = this.formGroup.get('key').value;

    const save$ = this.getSaveObservable(key, paramSpec);
    save$.subscribe({
      next: (result) => this.dialogRef.close(result),
      error: () => this.isButtonLoading.set(false),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  openAddSubParamDialog(): void {
    const input: TdEditParamSpecDialogInput = {
      paramSpecFormInfoList$: this.data.paramSpecFormInfoList$.pipe(
        map((list) => list.filter((i) => i.type !== TdParamSpecTypeEnum.PARAM_SET))
      ),
      dynamicParamSpecState: this.localParamSpecState,
      title: { text: 'td.add_sub_field', translateText: true },
      saveButtonText: { text: 'td.add_sub_field', translateText: true },
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe();
  }

  openEditSubParamDialog(entry: TdParamSpecEntry): void {
    const input: TdEditParamSpecDialogInput = {
      paramSpecFormInfoList$: this.data.paramSpecFormInfoList$.pipe(
        map((list) => list.filter((i) => i.type !== TdParamSpecTypeEnum.PARAM_SET))
      ),
      dynamicParamSpecState: this.localParamSpecState,
      paramSpec: entry,
      title: { text: 'td.update_sub_field', translateText: true },
      saveButtonText: { text: 'td.update_sub_field', translateText: true },
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe();
  }

  deleteSubParam(entry: TdParamSpecEntry): void {
    this.localParamSpecState.deleteParamSpec(entry.key).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.localParamSpecState?.ngOnDestroy();
  }

  private onParamSpecInfoLoaded(list: TdParamSpecInfo[]): void {
    this.paramSpecInfoList = list;
    this.groupedTypes.set(this.buildGroupedTypes(list));
    this.initForm();
    this.isLoading.set(false);
  }

  /** Groups the flat param spec info list by category for the mat-optgroup type selector. */
  private buildGroupedTypes(
    list: TdParamSpecInfo[]
  ): { category: string; options: FlDynamicFieldSelectKeyNameOption[] }[] {
    const groupMap = new Map<string, FlDynamicFieldSelectKeyNameOption[]>();
    for (const info of list) {
      if (!groupMap.has(info.category)) {
        groupMap.set(info.category, []);
      }
      const label = this.translateService.translate(`td.param_type.${info.type}`);
      groupMap.get(info.category).push({ key: info.type, humanName: label, group: info.category });
    }
    return Array.from(groupMap.entries()).map(([category, options]) => ({
      category: this.translateService.translate(`td.param_category.${category}`),
      options,
    }));
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      type: new FormControl('str', Validators.required),
      key: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)]),
      human_name: new FormControl(''),
      optional: new FormControl(false),
      default_value: new FormControl(null),
      short_description: new FormControl(''),
    });

    if (this.data.paramSpec) {
      this.formGroup.patchValue({
        ...this.data.paramSpec.spec,
        key: this.data.paramSpec.key,
      });
    }

    const currentType = this.formGroup.get('type').value;
    this.isParamSetType.set(currentType === TdParamSpecTypeEnum.PARAM_SET);

    if (currentType === TdParamSpecTypeEnum.PARAM_SET) {
      this.initLocalParamSpecState(this.data.paramSpec?.spec.additional_info?.param_set);
    }

    // Auto-sync label from key until the user manually edits the label
    this.subscriptions.add([
      this.formGroup.get('human_name').valueChanges.subscribe(() => {
        this.labelManuallyEdited = true;
      }),
      this.formGroup.get('key').valueChanges.subscribe((key: string) => {
        if (!this.labelManuallyEdited) {
          const label = ClStringHelper.snakeCaseToSentence(key);
          this.formGroup.get('human_name').setValue(label, { emitEvent: false });
        }
      }),
    ]);

    this.buildAdditionalInfoForm(this.formGroup.get('type').value, this.data.paramSpec?.spec.additional_info);
  }

  /**
   * Builds the dynamic form for type-specific fields (e.g. min/max for numbers, allowed_values for strings).
   * Looks up the additional_info definition for the given type, converts each field to a dynamic form config,
   * then generates and patches the form group with existing values from initialSpec.
   */
  private buildAdditionalInfoForm(type: TdParamSpecType, initialValue?: any): void {
    // Remove previous additional_info sub-group if it exists
    if (this.formGroup.contains('additional_info')) {
      this.formGroup.removeControl('additional_info');
    }

    const info = this.paramSpecInfoList.find((i) => i.type === type);

    if (!info?.additional_info || Object.keys(info.additional_info).length === 0) {
      this.additionalInfoFormGroupConfig.set(null);
      return;
    }

    const config: FlDynamicFormGroupConfig = { controlType: 'formGroup', subConfigs: {} };
    for (const specName of Object.keys(info.additional_info)) {
      // Skip 'param_set' key — managed by the sub-params list UI
      if (type === TdParamSpecTypeEnum.PARAM_SET && specName === TdParamSpecTypeEnum.PARAM_SET) continue;

      config.subConfigs[specName] = TdParamSpecConfig.convertParamSpecToAbstractConfig(
        info.additional_info[specName]
      );
    }

    if (Object.keys(config.subConfigs).length === 0) {
      this.additionalInfoFormGroupConfig.set(null);
      return;
    }

    const subGroup = FlDynamicFormHelper.generateFormGroup(config, initialValue);
    this.formGroup.addControl('additional_info', subGroup);
    this.additionalInfoFormGroupConfig.set(config);
  }

  private buildParamSpecFromForm(): TdParamSpec {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key: _key, ...specValue } = this.formGroup.value;

    if (specValue.type === TdParamSpecTypeEnum.PARAM_SET && this.localParamSpecState) {
      specValue.additional_info = {
        ...specValue.additional_info,
        param_set: this.localParamSpecState.getCurrentSpecs(),
      };
    }

    return {
      ...specValue,
      human_name: specValue.human_name || null,
      short_description: specValue.short_description || null,
    } as TdParamSpec;
  }

  /**
   * Returns the correct save observable depending on create/edit mode and whether the key was renamed.
   */
  private getSaveObservable(key: string, paramSpec: TdParamSpec): Observable<any> {
    const state = this.data.dynamicParamSpecState;

    if (!this.data.paramSpec) {
      return state.addParamSpec(key, paramSpec);
    }

    if (this.data.paramSpec?.key && key !== this.data.paramSpec.key) {
      return state.renameAndEditParamSpec(this.data.paramSpec.key, key, paramSpec);
    }
    return state.editParamSpec(key, paramSpec);
  }

  private initLocalParamSpecState(existingSpecs?: TdParamSpecs): void {
    this.localParamSpecState?.ngOnDestroy();
    this.localParamSpecState = new TdLocalParamSpecState(this.data.paramSpecFormInfoList$);
    if (existingSpecs) {
      this.localParamSpecState.setParamSpecs(existingSpecs);
    }
  }
}
