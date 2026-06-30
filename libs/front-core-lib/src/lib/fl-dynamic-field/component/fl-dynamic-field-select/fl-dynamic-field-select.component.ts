import { Component, input, OnInit, signal, WritableSignal } from '@angular/core';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';
import {
  FlDynamicFieldSelectKeyNameOption,
  FlDynamicFieldSelectOptions,
} from '../../model/fl-dynamic-field-config.class';

type FlGroupedSelectOption = Record<string, FlDynamicFieldSelectKeyNameOption[]>;

@Component({
  selector: 'fl-dynamic-field-select',
  templateUrl: './fl-dynamic-field-select.component.html',
  styleUrls: ['./fl-dynamic-field-select.component.scss'],
  standalone: false,
  host: { '[class.cell-rendering]': 'cellRendering()' },
})
export class FlDynamicFieldSelectComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  selectOptionsInput = input<FlDynamicFieldSelectOptions>();

  selectOptions: WritableSignal<FlDynamicFieldSelectKeyNameOption[]> = signal([]);

  selectOptionsGroups: WritableSignal<FlGroupedSelectOption> = signal(null);

  multiple = input<boolean>(false);

  prefix = input<string>();

  suffix = input<string>();

  ngOnInit(): void {
    const selectOptionsInput = this.selectOptionsInput();
    if (!selectOptionsInput?.length) {
      return;
    }

    const groups: FlGroupedSelectOption = {};
    const flat: FlDynamicFieldSelectKeyNameOption[] = [];

    for (const option of selectOptionsInput) {
      const normalized =
        typeof option === 'object' && option != null ? option : { key: option, humanName: option };

      if (normalized.group?.length > 0) {
        if (!groups[normalized.group]) groups[normalized.group] = [];
        groups[normalized.group].push(normalized);
      } else {
        flat.push(normalized);
      }
    }

    this.selectOptions.set(flat);
    this.selectOptionsGroups.set(groups);
  }
}
