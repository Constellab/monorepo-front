import { Directive, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

/**
 * Generic type for the Dynamic control components
 */
@Directive()
export class FlDynamicFieldAbstractDirective<T = any> {
  protected translateService = inject(FlTranslateService);

  formCtrl = input.required<FormControl<T>>();

  placeholder = input<string>();

  hint = input<string>();

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  /**
   * When true, the field renders as a table cell (no label/hint/error subscript)
   * for use inside the table layout of fl-dynamic-form-array. Errors are
   * surfaced via a tooltip ({@link tooltipError}) instead of the mat-error subscript.
   */
  cellRendering = input<boolean>(false);

  /**
   * First validation error as a human readable message. Single source of truth
   * for both the mat-error subscript (normal mode) and the tooltip (cell mode).
   * Kept as a getter (not a computed) so it re-evaluates every change-detection
   * pass and stays in sync with the reactive FormControl's validity, which is not
   * a signal. Subclasses with extra validators override this and fall back to
   * super.errorMessage. Empty string when there is no error.
   */
  get errorMessage(): string {
    if (this.formCtrl()?.hasError('required')) {
      return this.translateService.translate('flCorePipe.error_required', {
        param: { field: this.placeholder() },
      });
    }
    return '';
  }

  /** Label/placeholder shown only outside cell mode. */
  get visibleLabel(): string | undefined {
    return this.cellRendering() ? '' : this.placeholder();
  }

  /** Hint shown only outside cell mode. */
  get visibleHint(): string | undefined {
    return this.cellRendering() ? '' : this.hint();
  }

  /** Error text for the mat-error subscript (normal mode only). */
  get subscriptError(): string {
    return this.cellRendering() ? '' : this.errorMessage;
  }

  /** Error text for the tooltip (cell mode only). */
  get tooltipError(): string {
    return this.cellRendering() ? this.errorMessage : '';
  }
}
