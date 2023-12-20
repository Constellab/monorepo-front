import {Component, Input, OnInit} from '@angular/core';
import {TdParamSpec, TdParamSpecParamSet} from '@monorepo/technical-doc';

@Component({
  selector: 'ha-live-task-version-detail-config',
  templateUrl: './ha-live-task-version-detail-config.component.html',
  styleUrls: ['./ha-live-task-version-detail-config.component.scss'],
})
export class HaLiveTaskVersionDetailConfigComponent implements OnInit{
  @Input() configSpecs?: Record<string, TdParamSpec>;

  constructor() {
  }

  ngOnInit(): void {

  }

  public getParamSet(confSpec: TdParamSpec): Record<string, TdParamSpec> {
    return (confSpec as TdParamSpecParamSet)?.additional_info?.param_set;
  }

  public getMaxParamSetOccurrences(confSpec: TdParamSpec): number {
    return (confSpec as TdParamSpecParamSet)?.additional_info?.max_number_of_occurrences;
  }

}
