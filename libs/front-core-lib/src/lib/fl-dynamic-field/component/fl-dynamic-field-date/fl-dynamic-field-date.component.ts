import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';

@Component({
  selector: 'fl-dynamic-field-date',
  templateUrl: './fl-dynamic-field-date.component.html',
  styleUrl: './fl-dynamic-field-date.component.scss',
  standalone: false,
  host: { '[class.cell-rendering]': 'cellRendering()' },
})
export class FlDynamicFieldDateComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  private destroyRef = inject(DestroyRef);

  includeTime = input<boolean>(false);
  minValue = input<DateTime | null>(null);
  maxValue = input<DateTime | null>(null);

  dateTimeControl = new FormControl<DateTime | null>(null);

  private syncing = false;

  ngOnInit(): void {
    const formCtrl = this.formCtrl();

    // Seed the internal DateTime control from the string form control
    const initial = formCtrl.value;
    if (initial) {
      this.dateTimeControl.setValue(DateTime.fromISO(initial), { emitEvent: false });
    }

    // DateTime -> string (picker changed)
    this.dateTimeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dt) => {
      if (this.syncing) return;
      this.syncing = true;
      formCtrl.setValue(dt ? (this.includeTime() ? dt.toISO() : dt.toFormat('yyyy-MM-dd')) : null);
      this.syncing = false;
    });

    // string -> DateTime (external form control changed)
    formCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (this.syncing) return;
      this.syncing = true;
      this.dateTimeControl.setValue(value ? DateTime.fromISO(value) : null, { emitEvent: false });
      this.syncing = false;
    });
  }
}
