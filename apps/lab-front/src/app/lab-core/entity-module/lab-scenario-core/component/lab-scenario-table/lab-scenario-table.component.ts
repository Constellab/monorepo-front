import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic, FlTag } from '@monorepo/front-core-lib';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
  selector: 'lab-scenario-table',
  templateUrl: './lab-scenario-table.component.html',
  styleUrls: ['./lab-scenario-table.component.scss']
})
export class LabScenarioTableComponent {

  @Input() datasource: FlArrayObs<LabScenario>;

  @Input() columns: FlTableColumnStatic<LabScenario>[] = ['title', 'status', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() scenarioSelected: EventEmitter<LabScenario> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() scenarioUnlink: EventEmitter<LabScenario> = new EventEmitter();

  rowClicked(scenario: LabScenario): void {
    if (this.rowSelectable) {
      this.scenarioSelected.next(scenario);
    }
  }

  unlinkedScenario(scenario: LabScenario, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.scenarioUnlink.next(scenario);
  }
}
