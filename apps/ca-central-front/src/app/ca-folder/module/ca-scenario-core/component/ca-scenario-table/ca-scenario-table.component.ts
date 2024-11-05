import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';

@Component({
  selector: 'ca-scenario-table',
  templateUrl: './ca-scenario-table.component.html',
  styleUrls: ['./ca-scenario-table.component.scss'],
})
export class CaScenarioTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaScenario>;

  @Input() columns: FlTableColumnStatic<CaScenario>[] = ['title', 'lastSync', 'status', 'createdBy'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() scenarioSelected: EventEmitter<CaScenario> = new EventEmitter();

  rowClicked(scenario: CaScenario): void {
    if (this.rowSelectable) {
      this.scenarioSelected.next(scenario);
    }
  }
}
