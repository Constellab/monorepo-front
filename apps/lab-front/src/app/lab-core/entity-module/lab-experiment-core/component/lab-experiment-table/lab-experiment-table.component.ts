import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlArrayObs, FlTableColumnStatic, FlTag, FlTagSelectedEvent} from '@monorepo/front-core-lib';
import {LabExperiment} from '../../../../model/entities/lab-experiment.entity';
import {ClHelpService} from '@monorepo/core-lib';
import {LabExperimentService} from '../../../../entity-service/lab-experiment.service';

@Component({
  selector: 'lab-experiment-table',
  templateUrl: './lab-experiment-table.component.html',
  styleUrls: ['./lab-experiment-table.component.scss']
})
export class LabExperimentTableComponent {

  @Input() datasource: FlArrayObs<LabExperiment>;

  @Input() columns: FlTableColumnStatic<LabExperiment>[] = ['title', 'status', 'tags', 'createdAt'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() experimentSelected: EventEmitter<LabExperiment> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() experimentDisassociate: EventEmitter<LabExperiment> = new EventEmitter();

  constructor(private experimentService: LabExperimentService) {
  }

  rowClicked(experiment: LabExperiment): void {
    if (this.rowSelectable) {
      this.experimentSelected.next(experiment);
    }
  }

  onTagSelected(tagEvent: FlTagSelectedEvent): void {
    ClHelpService.stopEventPropagation(tagEvent.event);
    this.tagSelected.next(tagEvent.tag);
  }

  disassociateExperiment(experiment: LabExperiment, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.experimentDisassociate.next(experiment);
  }
}
