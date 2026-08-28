import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import {
  FL_TABLE_SUPPORTED_FIELD_TYPES,
  FlDynamicFieldConfig,
  FlDynamicFormArrayConfig,
} from '../../model/fl-dynamic-field-config.class';
import { FlDynamicFormHelper } from '../../model/fl-dynamic-form-helper.class';

interface FlDynamicFormArrayColumn {
  key: string;
  config: FlDynamicFieldConfig;
}

// Getters cannot be replaced by computed signals: control().length is reactive form state, not a signal,
// so computed() would not re-evaluate when the form array changes.
@Component({
  selector: 'fl-dynamic-form-array',
  templateUrl: './fl-dynamic-form-array.component.html',
  styleUrls: ['./fl-dynamic-form-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlDynamicFormArrayComponent implements FlDynamicAbstractFormDirective {
  private translateService = inject(FlTranslateService);

  control = input.required<UntypedFormArray>();

  config = input.required<FlDynamicFormArrayConfig>();

  addGroup(): void {
    FlDynamicFormHelper.addFormGroupToFormArray(
      this.control(),
      this.config(),
      ClHelpService.deepClone(this.config().newElementDefaultValue)
    );
  }

  removeGroup(index: number): void {
    this.control().removeAt(index);
  }

  hasValue(): boolean {
    return this.control().length > 0;
  }

  /**
   * True when every field of the group is a supported scalar control, so the
   * array can render as an Excel-like table. Otherwise we fall back to the
   * default list rendering.
   */
  get isTableMode(): boolean {
    const subConfigs = this.config().formGpConfig?.subConfigs;
    if (!subConfigs) {
      return false;
    }
    return Object.values(subConfigs).every(
      (config) =>
        config.controlType === 'formControl' &&
        FL_TABLE_SUPPORTED_FIELD_TYPES.includes((config as FlDynamicFieldConfig).type)
    );
  }

  /** Columns of the table, one per field of the group, preserving key order. */
  get columns(): FlDynamicFormArrayColumn[] {
    const subConfigs = this.config().formGpConfig.subConfigs;
    return Object.keys(subConfigs).map((key) => ({
      key,
      config: subConfigs[key] as FlDynamicFieldConfig,
    }));
  }

  get disableAdd(): boolean {
    const maxSize = this.config().maxSize;
    return maxSize != null && this.control().length >= maxSize;
  }

  get disableRemove(): boolean {
    const minSize = this.config().minSize;
    return minSize != null && this.control().length <= minSize;
  }

  get addTooltip(): string {
    if (this.disableAdd) {
      return this.translateService.translate('flDynamicField.form_array_add_disable', {
        param: { value: this.config().maxSize },
      });
    } else {
      return this.translateService.translate('flDynamicField.add_value_in_array');
    }
  }

  get removeTooltip(): string {
    if (this.disableRemove) {
      return this.translateService.translate('flDynamicField.form_array_delete_disable', {
        param: { value: this.config().minSize },
      });
    } else {
      return this.translateService.translate('flDynamicField.remove_value_from_array');
    }
  }
}
