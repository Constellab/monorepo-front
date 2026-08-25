import { Directive, inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

/**
 * Generic type for the Dynamic control components
 */
@Directive()
export class FlDynamicFieldAbstractDirective {
  protected translateService = inject(FlTranslateService);

  @Input() formCtrl: FormControl;

  @Input() placeholder?: string;

  @Input() hint?: string;

  @Input() disabled: boolean;

  @Input() required: boolean;

  /**
   * When true, the field renders as a table cell (no label/hint/error subscript)
   * for use inside the table layout of fl-dynamic-form-array. Errors are
   * surfaced via a tooltip ({@link errorMessage}) instead of the mat-error subscript.
   */
  @Input() cellRendering = false;

  /**
   * First validation error as a human readable message. Single source of truth
   * for both the mat-error subscript (normal mode) and the tooltip (cell mode).
   * Subclasses with extra validators override this and fall back to
   * super.errorMessage for the shared cases. Empty string when there is no error.
   */
  get errorMessage(): string {
    if (this.formCtrl?.hasError('required')) {
      return this.translateService.translate('flCorePipe.error_required', {
        param: { field: this.placeholder },
      });
    }
    return '';
  }
}
