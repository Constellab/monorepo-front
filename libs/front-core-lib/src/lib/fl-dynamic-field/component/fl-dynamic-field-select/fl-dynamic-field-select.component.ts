import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';

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
})
export class FlDynamicFieldSelectComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  @Input() selectOptionsInput: FlDynamicFieldSelectOptions;

  selectOptions: WritableSignal<FlDynamicFieldSelectKeyNameOption[]> = signal([]);

  selectOptionsGroups: WritableSignal<FlGroupedSelectOption> = signal(null);

  @Input() multiple = false;

  @Input() prefix: string;

  @Input() suffix: string;

  ngOnInit(): void {
    if (!this.selectOptionsInput?.length) {
      return;
    }

    const groups: FlGroupedSelectOption = {};
    const flat: FlDynamicFieldSelectKeyNameOption[] = [];

    for (const option of this.selectOptionsInput) {
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
