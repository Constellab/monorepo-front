import { Component, Input } from '@angular/core';
import { TdParamSpec, TdParamSpecParamSet, TdParamSpecs } from '../../model/td-config-spec.class';

@Component({
  selector: 'td-config',
  templateUrl: './td-config.component.html',
  styleUrls: ['./td-config.component.scss'],
})
export class TdConfigComponent {
  @Input() configSpecs?: TdParamSpecs;

  public getParamSet(confSpec: TdParamSpec): TdParamSpecs {
    return (confSpec as TdParamSpecParamSet)?.additional_info?.param_set;
  }

  public getMaxParamSetOccurrences(confSpec: TdParamSpec): number {
    return (confSpec as TdParamSpecParamSet)?.additional_info?.max_number_of_occurrences;
  }
}
