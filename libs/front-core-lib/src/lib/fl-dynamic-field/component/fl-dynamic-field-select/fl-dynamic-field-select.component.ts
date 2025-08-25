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

  @Input() prefix: string;

  @Input() suffix: string;

  ngOnInit(): void {
    if (this.selectOptionsInput?.length === 0) {
      return;
    }

    if (typeof this.selectOptionsInput[0] != 'string') {
      this.selectOptions.set(this.selectOptionsInput as FlDynamicFieldSelectKeyNameOption[]);
    }

    const groups: FlGroupedSelectOption = {};

    for (const option of this.selectOptionsInput) {
      if (typeof option === 'object' && option.group && option.group.length > 0) {
        if (!groups[option.group]) groups[option.group] = [];
        groups[option.group].push(option);
      } else {
        this.selectOptions.update((current) => [...current, { key: option, humanName: option }]);
      }
    }

    this.selectOptionsGroups.set(groups);
  }
}
