import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Directive that enforces selection from autocomplete options.
 * On blur, if the value is a free-text string (not a selected option), it reverts to the last valid value.
 * On focus, it selects all text so the user can easily type over it.
 *
 * Usage:
 * ```html
 * <input matInput
 *   [formControl]="searchControl"
 *   [matAutocomplete]="auto"
 *   flAutocompleteForceSelection
 *   [flAutocompleteForceSelectionControl]="searchControl"
 *   [flAutocompleteForceSelectionValue]="currentValue()"
 *   [flAutocompleteForceSelectionIsValid]="isValidFn" />
 * ```
 */
@Directive({
  selector: '[flAutocompleteForceSelection]',
  standalone: false,
})
export class FlAutocompleteForceSelectionDirective<T> implements OnInit, OnDestroy {
  /**
   * The FormControl driving the input
   */
  readonly control = input.required<FormControl>({
    alias: 'flAutocompleteForceSelectionControl',
  });

  /**
   * The current valid value to revert to on invalid blur
   */
  readonly value = input.required<T>({
    alias: 'flAutocompleteForceSelectionValue',
  });

  /**
   * Optional function to check if a value is valid (i.e. was selected from the list).
   * Defaults to checking that the value is not a string (since typed text is a string,
   * while selected options are typically objects or enum values passed through displayWith).
   */
  readonly isValid = input<(value: any) => boolean>((v) => typeof v !== 'string', {
    alias: 'flAutocompleteForceSelectionIsValid',
  });

  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  ngOnInit(): void {
    const inputEl = this.el.nativeElement;

    inputEl.addEventListener('focus', this.onFocus);
    inputEl.addEventListener('blur', this.onBlur);
  }

  private onFocus = (): void => {
    const inputEl = this.el.nativeElement;
    if (inputEl.value) {
      // Use setTimeout so the selection happens after the autocomplete panel opens
      setTimeout(() => inputEl.setSelectionRange(0, inputEl.value.length), 0);
    }
  };

  private onBlur = (): void => {
    // Delay to allow optionSelected to fire first
    setTimeout(() => {
      const currentValue = this.control().value;
      if (!this.isValid()(currentValue)) {
        this.control().setValue(this.value(), { emitEvent: false });
      }
    }, 200);
  };

  ngOnDestroy(): void {
    const inputEl = this.el.nativeElement;
    inputEl.removeEventListener('focus', this.onFocus);
    inputEl.removeEventListener('blur', this.onBlur);
  }
}
