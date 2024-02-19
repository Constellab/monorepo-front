import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlArrayObs, FlTableColumnStatic, FlTag} from '@monorepo/front-core-lib';
import {LabExperiment} from '../../../../model/entities/lab-experiment.entity';
import {ClHelpService} from '@monorepo/core-lib';

@Component({
  selector: 'lab-experiment-table',
  templateUrl: './lab-experiment-table.component.html',
  styleUrls: ['./lab-experiment-table.component.scss']
})
export class LabExperimentTableComponent {

  @Input() datasource: FlArrayObs<LabExperiment>;

  @Input() columns: FlTableColumnStatic<LabExperiment>[] = ['title', 'status', 'tags', 'createdAt'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() experimentSelected: EventEmitter<LabExperiment> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() experimentUnlink: EventEmitter<LabExperiment> = new EventEmitter();

  rowClicked(experiment: LabExperiment): void {
    if (this.rowSelectable) {
      this.experimentSelected.next(experiment);
    }
  }

  unlinkedExperiment(experiment: LabExperiment, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.experimentUnlink.next(experiment);
  }
}
