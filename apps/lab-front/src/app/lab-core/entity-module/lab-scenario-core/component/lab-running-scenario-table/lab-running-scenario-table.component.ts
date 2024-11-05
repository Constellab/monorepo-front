import { Component, Input, OnInit } from '@angular/core';
import { FlDatasource } from '@monorepo/front-core-lib';
import { LabRunningScenarioInfo } from '../../../../model/entities/lab-scenario.entity';

@Component({
  selector: 'lab-running-scenario-table',
  templateUrl: './lab-running-scenario-table.component.html',
  styleUrls: ['./lab-running-scenario-table.component.scss'],
})
export class LabRunningScenarioTableComponent implements OnInit {
  @Input() datasource: FlDatasource<LabRunningScenarioInfo>;

  @Input() columns: string[];

  constructor() {}

  ngOnInit(): void {}
}
