import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import { FlDynamicFormArrayConfig } from '../../model/fl-dynamic-field-config.class';
import { FlDynamicFormHelper } from '../../model/fl-dynamic-form-helper.class';

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

  control = input<UntypedFormArray>();

  config = input<FlDynamicFormArrayConfig>();

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

  get disableAdd(): boolean {
    return this.config().maxSize != null && this.control().length >= this.config().maxSize;
  }

  get disableRemove(): boolean {
    return this.config().minSize != null && this.control().length <= this.config().minSize;
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
