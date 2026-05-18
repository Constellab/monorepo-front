import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldConfig } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import {
  TD_TYPES_WITHOUT_DEFAULT_VALUE,
  tdBuildGroupedTypes,
  TdGroupedParamSpecTypes,
  TdParamSpec,
  TdParamSpecBase,
  TdParamSpecEntry,
  TdParamSpecs,
  TdParamSpecTypeEnum,
  TdSelectParamOption,
  TdValidateComputedParamResult,
} from '../../model/td-config-spec.class';
import { TdParamSpecConfig } from '../../model/td-param-spec-config.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';
import { TdSubParamSpecState } from '../../service/td-sub-param-spec.state';

export interface TdEditParamSpecDialogInput {
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
export class TdEditParamSpecDialogComponent implements OnInit, OnDestroy {
  private dialogRef = inject<MatDialogRef<TdEditParamSpecDialogComponent>>(MatDialogRef);
  private dialogService = inject(FlDialogService);
  private portalService = inject(FlPortalService);
  private viewContainerRef = inject(ViewContainerRef);
  private translateService = inject(FlTranslateService);

  @ViewChild('expressionHelpTemplate') expressionHelpTemplate: TemplateRef<any>;
  private helpOverlayRef: FlOverlayRef | null = null;

  readonly keyEditing = signal(false);
  readonly isButtonLoading = signal(false);
  readonly groupedTypes = signal<TdGroupedParamSpecTypes[]>([]);
  readonly typeSearchControl = new FormControl('');
  readonly typeSearchText = signal('');
  readonly filteredGroupedTypes = computed(() => {
    const search = this.typeSearchText().toLowerCase().trim();
    const groups = this.groupedTypes();
    if (!search) return groups;

    return groups
      .map((group) => ({
        category: group.category,
        types: group.types.filter((type) =>
          this.translateService
            .translate('td.param_type.' + type)
            .toLowerCase()
            .includes(search)
        ),
      }))
      .filter((group) => group.types.length > 0);
  });
  readonly isParamSetType = signal(false);
  readonly hideDefaultValue = signal(false);
  readonly selectedType = signal<TdParamSpecTypeEnum>(TdParamSpecTypeEnum.STR);
  readonly defaultValueConfig = signal<FlDynamicFieldConfig | null>(null);
  readonly isValidating = signal(false);
  readonly validationResult = signal<TdValidateComputedParamResult | null>(null);
  readonly siblingFieldSpecs = computed(() => {
    const currentKey = this.formGroup?.get('key')?.value;
    return this.data.dynamicParamSpecState.paramSpecsTable.array.filter((e) => e.key !== currentKey);
  });

  formGroup: FormGroup;
  readonly formId = `paramSpecForm_${Math.random().toString(36).slice(2, 8)}`;
  subParamSpecState: TdSubParamSpecState | null = null;

  data = inject<TdEditParamSpecDialogInput>(MAT_DIALOG_DATA);

  private keyManuallyEdited = false;
  private subscriptions = new ClSubscriptionHandler();

  typeDisplayFn = (type: TdParamSpecTypeEnum): string => {
    if (!type) return '';
    return this.translateService.translate('td.param_type.' + type);
  };

  private allTypeValues = new Set(Object.values(TdParamSpecTypeEnum));
  isValidType = (value: any): boolean => this.allTypeValues.has(value);

  ngOnInit(): void {
    const list = this.data.dynamicParamSpecState.getParamSpecsInfos();
    this.groupedTypes.set(tdBuildGroupedTypes(list));
    this.initForm();

    this.typeSearchControl.valueChanges.subscribe((value) => {
      this.typeSearchText.set(typeof value === 'string' ? value : '');
    });
  }

  onTypeSelected(type: TdParamSpecTypeEnum): void {
    this.formGroup.get('type').setValue(type);
    this.typeSearchControl.setValue(type as any, { emitEvent: false });
    this.typeSearchText.set('');
    this.onTypeChange(type);
  }

  onTypeChange(type: TdParamSpecTypeEnum): void {
    this.formGroup.get('default_value').reset(null);
    this.isParamSetType.set(type === TdParamSpecTypeEnum.PARAM_SET);
    this.hideDefaultValue.set(TD_TYPES_WITHOUT_DEFAULT_VALUE.includes(type));
    this.selectedType.set(type);
    this.buildAdditionalInfoControls(type);
    this.buildDefaultValueConfig(type);

    if (type === TdParamSpecTypeEnum.PARAM_SET) {
      this.initLocalParamSpecState();
    } else {
      this.subParamSpecState = null;
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

  enableKeyEditing(): void {
    this.keyEditing.set(true);
    this.keyManuallyEdited = true;
  }

  cancelKeyEditing(): void {
    this.keyEditing.set(false);
    this.keyManuallyEdited = false;
    const label = this.formGroup.get('human_name').value || '';
    const key = ClStringHelper.sentenceToSnakeCase(label).slice(0, 20);
    this.formGroup.get('key').setValue(key, { emitEvent: false });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  openAddSubParamDialog(): void {
    const input: TdEditParamSpecDialogInput = {
      dynamicParamSpecState: this.subParamSpecState,
      title: { text: 'td.add_sub_field', translateText: true },
      saveButtonText: { text: 'td.add_sub_field', translateText: true },
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe();
  }

  openEditSubParamDialog(entry: TdParamSpecEntry): void {
    const input: TdEditParamSpecDialogInput = {
      dynamicParamSpecState: this.subParamSpecState,
      paramSpec: entry,
      title: { text: 'td.update_sub_field', translateText: true },
      saveButtonText: { text: 'td.update_sub_field', translateText: true },
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe();
  }

  addSelectOption(): void {
    const control = this.formGroup.get('additional_info.options');
    const current: TdSelectParamOption[] = control.value ?? [];
    control.setValue([...current, { label: null, value: null }]);
  }

  removeSelectOption(index: number): void {
    const control = this.formGroup.get('additional_info.options');
    const current: TdSelectParamOption[] = [...(control.value ?? [])];
    if (current.length <= 1) return;
    current.splice(index, 1);
    control.setValue(current);
  }

  updateSelectOption(index: number, value: string): void {
    const control = this.formGroup.get('additional_info.options');
    const current: TdSelectParamOption[] = [...(control.value ?? [])];
    current[index] = { label: value, value };
    control.setValue(current);
  }

  deleteSubParam(entry: TdParamSpecEntry): void {
    this.subParamSpecState.deleteParamSpec(entry.key).subscribe();
  }

  reorderSubParams(paramNames: string[]): void {
    this.subParamSpecState.reorderParamSpecs(paramNames)?.subscribe();
  }

  validateExpression(): void {
    const expression = this.formGroup.get('additional_info.expression')?.value;
    if (!expression) return;

    const validate$ = this.data.dynamicParamSpecState.validateComputedExpression(
      expression,
      this.formGroup.get('key')?.value || undefined
    );
    if (!validate$) return;

    this.isValidating.set(true);
    this.validationResult.set(null);

    validate$.subscribe({
      next: (result) => {
        this.validationResult.set(result);
        this.isValidating.set(false);
      },
      error: () => {
        this.isValidating.set(false);
      },
    });
  }

  openExpressionHelp(event: MouseEvent): void {
    if (this.helpOverlayRef) {
      this.helpOverlayRef.dispose();
      return;
    }

    const config = this.portalService.configureRelativePortal(
      event.target as Element,
      ['bottom', 'right', 'left', 'top'],
      { disposeOnOutsideClick: true }
    );

    this.helpOverlayRef = this.portalService.createPortalTemplate(
      this.expressionHelpTemplate,
      config,
      this.viewContainerRef
    );

    this.helpOverlayRef.detachments().subscribe(() => {
      this.helpOverlayRef = null;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.subParamSpecState?.ngOnDestroy();
    this.helpOverlayRef?.dispose();
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      type: new FormControl('str', Validators.required),
      key: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
        Validators.maxLength(20),
      ]),
      human_name: new FormControl('', Validators.required),
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
    this.typeSearchControl.setValue(currentType, { emitEvent: false });
    this.isParamSetType.set(currentType === TdParamSpecTypeEnum.PARAM_SET);
    this.hideDefaultValue.set(TD_TYPES_WITHOUT_DEFAULT_VALUE.includes(currentType));
    this.selectedType.set(currentType);

    if (currentType === TdParamSpecTypeEnum.PARAM_SET) {
      this.initLocalParamSpecState(this.data.paramSpec?.spec.additional_info?.param_set);
    }

    // In edit mode, key was already set — don't auto-sync
    if (this.data.paramSpec) {
      this.keyManuallyEdited = true;
    }

    // Auto-sync key from label until the user manually edits the key
    this.subscriptions.add([
      this.formGroup.get('key').valueChanges.subscribe(() => {
        this.keyManuallyEdited = true;
      }),
      this.formGroup.get('human_name').valueChanges.subscribe((label: string) => {
        if (!this.keyManuallyEdited) {
          const key = ClStringHelper.sentenceToSnakeCase(label).slice(0, 20);
          this.formGroup.get('key').setValue(key, { emitEvent: false });
        }
      }),
    ]);

    this.buildAdditionalInfoControls(currentType, this.data.paramSpec?.spec.additional_info);
    this.buildDefaultValueConfig(currentType, this.data.paramSpec?.spec.additional_info);
  }

  private buildDefaultValueConfig(type: TdParamSpecTypeEnum, additionalInfo?: any): void {
    if (TD_TYPES_WITHOUT_DEFAULT_VALUE.includes(type)) {
      this.defaultValueConfig.set(null);
      return;
    }

    const spec: TdParamSpecBase = {
      type,
      optional: true,
      visibility: 'public',
      human_name: this.translateService.translate('td.default_value'),
      short_description: null,
      additional_info: additionalInfo ?? {},
    };

    this.defaultValueConfig.set(TdParamSpecConfig.convertParamSpecToAbstractConfig(spec));
  }

  /**
   * Builds type-specific form controls for the additional_info section.
   * Each type gets its own set of controls instead of using a generic dynamic form.
   */
  private buildAdditionalInfoControls(type: TdParamSpecTypeEnum, initialValue?: any): void {
    if (this.formGroup.contains('additional_info')) {
      this.formGroup.removeControl('additional_info');
    }

    let group: FormGroup | null = null;

    switch (type) {
      case TdParamSpecTypeEnum.STR:
        group = new FormGroup({
          min_length: new FormControl(initialValue?.min_length ?? null),
          max_length: new FormControl(initialValue?.max_length ?? null),
        });
        break;
      case TdParamSpecTypeEnum.INT:
      case TdParamSpecTypeEnum.FLOAT:
        group = new FormGroup({
          min_value: new FormControl(initialValue?.min_value ?? null),
          max_value: new FormControl(initialValue?.max_value ?? null),
        });
        break;
      case TdParamSpecTypeEnum.COMPUTED_PARAM:
        group = new FormGroup({
          expression: new FormControl(initialValue?.expression ?? null, Validators.required),
        });
        break;
      case TdParamSpecTypeEnum.PARAM_SET:
        group = new FormGroup({
          max_number_of_occurrences: new FormControl(initialValue?.max_number_of_occurrences ?? null),
        });
        break;
      case TdParamSpecTypeEnum.CREDENTIALS_PARAM:
        group = new FormGroup({
          credentials_type: new FormControl(initialValue?.credentials_type ?? null),
        });
        break;
      case TdParamSpecTypeEnum.SELECT_PARAM:
        group = new FormGroup({
          options: new FormControl(
            initialValue?.options ?? [{ label: null, value: null }],
            Validators.required
          ),
          multiple: new FormControl(initialValue?.multiple ?? false),
        });
        break;
      case TdParamSpecTypeEnum.DATE_PARAM:
        group = new FormGroup({
          include_time: new FormControl(initialValue?.include_time ?? false),
          min_value: new FormControl(
            initialValue?.min_value ? DateTime.fromISO(initialValue.min_value) : null
          ),
          max_value: new FormControl(
            initialValue?.max_value ? DateTime.fromISO(initialValue.max_value) : null
          ),
        });
        break;
    }

    if (group) {
      this.formGroup.addControl('additional_info', group);
      this.subscriptions.add([
        group.valueChanges.subscribe((value) => {
          this.buildDefaultValueConfig(type, value);
        }),
      ]);
    }
  }

  private buildParamSpecFromForm(): TdParamSpec {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key: _key, ...specValue } = this.formGroup.value;

    if (specValue.type === TdParamSpecTypeEnum.PARAM_SET && this.subParamSpecState) {
      specValue.additional_info = {
        ...specValue.additional_info,
        param_set: this.subParamSpecState.getCurrentSpecs(),
      };
    }

    if (specValue.type === TdParamSpecTypeEnum.DATE_PARAM && specValue.additional_info) {
      const info = specValue.additional_info;
      specValue.additional_info = {
        ...info,
        min_value:
          info.min_value instanceof DateTime ? info.min_value.toFormat('yyyy-MM-dd') : info.min_value,
        max_value:
          info.max_value instanceof DateTime ? info.max_value.toFormat('yyyy-MM-dd') : info.max_value,
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
    this.subParamSpecState?.ngOnDestroy();
    this.subParamSpecState = new TdSubParamSpecState(
      this.data.dynamicParamSpecState,
      () => this.formGroup.get('key')?.value
    );
    if (existingSpecs) {
      this.subParamSpecState.setParamSpecs(existingSpecs);
    }
  }
}
