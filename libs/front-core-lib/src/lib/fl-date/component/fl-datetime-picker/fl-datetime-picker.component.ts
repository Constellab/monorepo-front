import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'fl-datetime-picker',
  templateUrl: './fl-datetime-picker.component.html',
  styleUrl: './fl-datetime-picker.component.scss',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FlDatetimePickerComponent,
      multi: true,
    },
  ],
})
export class FlDatetimePickerComponent implements ControlValueAccessor, OnInit {
  private destroyRef = inject(DestroyRef);

  /**
   * Whether to show only date or date + time
   */
  mode = input<'date' | 'datetime'>('datetime');

  /**
   * Label for the date field
   */
  label = input<string>('');

  /**
   * Hint text displayed below the date field
   */
  hint = input<string>('');

  /**
   * Minimum selectable date
   */
  min = input<DateTime | null>(null);

  /**
   * Maximum selectable date
   */
  max = input<DateTime | null>(null);

  /**
   * Compact layout: removes the gap between the date and time inputs so they
   * sit flush against each other (used inside table cells).
   */
  cellRendering = input<boolean>(false);

  /**
   * Marks the field as required (shows the asterisk on the label).
   */
  required = input<boolean>(false);

  /**
   * Whether the field should render in the error (warn) state. The validators
   * live on the outer form control, so the invalid state has to be passed in
   * explicitly: the inner date/time controls carry no validators of their own.
   */
  errorState = input<boolean>(false);

  /**
   * Error message shown below the date field while {@link errorState} is true.
   * Empty string renders no message (e.g. cell rendering surfaces errors via a
   * tooltip instead).
   */
  errorMessage = input<string>('');

  /**
   * Emitted when the value changes
   */
  valueChange = output<DateTime | null>();

  dateControl = new FormControl<DateTime | null>(null);
  timeControl = new FormControl<DateTime | null>(null);

  // Drives the warn color on the inner mat-form-field from the injected
  // errorState input rather than the inner control's own validity.
  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.errorState(),
  };

  disabled = false;

  private onChange: (value: DateTime | null) => void = () => {};
  private onTouched: () => void = () => {};
  private updating = false;

  ngOnInit(): void {
    this.dateControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((date) => {
      if (this.updating) return;
      this.emitCombinedValue(date, this.timeControl.value);
    });

    this.timeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((time) => {
      if (this.updating) return;
      this.emitCombinedValue(this.dateControl.value, time);
    });
  }

  writeValue(value: DateTime | string | null): void {
    const dateTime = typeof value === 'string' ? DateTime.fromISO(value) : value;
    this.updating = true;
    this.dateControl.setValue(dateTime, { emitEvent: false });
    this.timeControl.setValue(dateTime, { emitEvent: false });
    this.updating = false;
  }

  registerOnChange(fn: (value: DateTime | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.dateControl.disable({ emitEvent: false });
      this.timeControl.disable({ emitEvent: false });
    } else {
      this.dateControl.enable({ emitEvent: false });
      this.timeControl.enable({ emitEvent: false });
    }
  }

  private emitCombinedValue(date: DateTime | null, time: DateTime | null): void {
    let combined: DateTime | null = null;

    if (date) {
      combined = date;
      if (this.mode() === 'datetime' && time) {
        combined = combined.set({ hour: time.hour, minute: time.minute, second: time.second });
      }
    }

    this.onChange(combined);
    this.onTouched();
    this.valueChange.emit(combined);
  }
}
