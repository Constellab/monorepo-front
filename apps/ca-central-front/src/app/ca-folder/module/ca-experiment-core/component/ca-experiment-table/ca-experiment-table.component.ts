import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaExperiment } from '../../../../../ca-core/model/entities/folder/ca-experiment.class';

@Component({
  selector: 'ca-experiment-table',
  templateUrl: './ca-experiment-table.component.html',
  styleUrls: ['./ca-experiment-table.component.scss']
})
export class CaExperimentTableComponent {

  @Input({required: true}) datasource: FlDatasource<CaExperiment>;

  @Input() columns: FlTableColumnStatic<CaExperiment>[] = ['title', 'lastSync', 'status', 'createdBy'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() experimentSelected: EventEmitter<CaExperiment> = new EventEmitter();

  rowClicked(experiment: CaExperiment): void {
    if (this.rowSelectable) {
      this.experimentSelected.next(experiment);
    }
  }

}
