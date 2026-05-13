import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TdComputedParamValue,
  TdParamSpec,
  TdParamSpecParamSet,
  TdParamSpecTypeEnum,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-form-value',
  templateUrl: './li-form-value.component.html',
  styleUrl: './li-form-value.component.scss',
  imports: [MatButton, MatIcon, MatTooltip, TranslatePipe],
})
export class LiFormValueComponent {
  private dialogService = inject(FlDialogService);

  value = input.required<unknown>();
  spec = input.required<TdParamSpec>();

  isComputed = computed(() => this.spec()?.type === TdParamSpecTypeEnum.COMPUTED_PARAM);
  isParamSet = computed(() => this.spec()?.type === TdParamSpecTypeEnum.PARAM_SET);

  displayValue = computed(() => {
    const raw = this.value();
    const resolved = this.isComputed() ? (raw as TdComputedParamValue)?.value : raw;
    if (this.isComputed() && (resolved == null || resolved === '')) return '-';
    return this.formatValue(resolved);
  });

  expression = computed<string>(() => {
    if (!this.isComputed()) return '';
    return (this.spec()?.additional_info as { expression?: string })?.expression ?? '';
  });

  error = computed<string>(() => {
    if (!this.isComputed()) return '';
    return (this.value() as TdComputedParamValue)?.errors ?? '';
  });

  paramSetRowCount = computed(() => {
    if (!this.isParamSet()) return 0;
    const raw = this.value();
    return Array.isArray(raw) ? raw.length : 0;
  });

  openParamSetDialog(): void {
    const spec = this.spec() as TdParamSpecParamSet;
    const raw = this.value();
    import('../li-form-param-set-table-dialog/li-form-param-set-table-dialog.component').then(
      ({ LiFormParamSetTableDialogComponent }) => {
        this.dialogService.openMediumDialog(LiFormParamSetTableDialogComponent, {
          data: {
            title: spec.human_name || '',
            data: Array.isArray(raw) ? raw : [],
            specs: spec.additional_info?.param_set,
          },
        });
      }
    );
  }

  private formatValue(value: unknown): string {
    if (value == null) return '';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }
    if (Array.isArray(value)) {
      return value.map((v) => String(v ?? '')).join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }
}
