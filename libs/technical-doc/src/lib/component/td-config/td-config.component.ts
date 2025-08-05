import { Component, computed, input, Signal } from '@angular/core';

import { TdParamSpecParamSet, TdParamSpecs } from '../../model/td-config-spec.class';

@Component({
  selector: 'td-config',
  templateUrl: './td-config.component.html',
  styleUrls: ['./td-config.component.scss'],
  standalone: false,
})
export class TdConfigComponent {
  configSpecs = input<TdParamSpecs>();

  paramSet: Signal<Record<string, TdParamSpecs>> = computed(() => {
    const record: Record<string, TdParamSpecs> = {};
    for (const configSpec of Object.keys(this.configSpecs())) {
      record[configSpec] = (
        this.configSpecs()[configSpec] as TdParamSpecParamSet
      )?.additional_info?.param_set;
    }
    return record;
  });

  naxParamSetOccurrences: Signal<Record<string, number>> = computed(() => {
    const record: Record<string, number> = {};
    for (const configSpec of Object.keys(this.configSpecs())) {
      record[configSpec] = (
        this.configSpecs()[configSpec] as TdParamSpecParamSet
      )?.additional_info?.max_number_of_occurrences;
    }
    return record;
  });
}
