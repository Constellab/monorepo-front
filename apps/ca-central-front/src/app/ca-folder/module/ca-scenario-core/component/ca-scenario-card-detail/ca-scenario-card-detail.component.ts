import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';

/**
 * Detail card of the scenario used in the scenario page
 */
@Component({
  selector: 'ca-scenario-card-detail',
  templateUrl: './ca-scenario-card-detail.component.html',
  styleUrls: ['./ca-scenario-card-detail.component.scss'],
})
export class CaScenarioCardDetailComponent implements OnInit {
  @Input({ required: true }) scenario: CaScenario;

  @Input() showCardHeader: boolean = true;

  @Output() update: EventEmitter<CaScenario> = new EventEmitter<CaScenario>();

  scenarioRoute: string;

  ngOnInit(): void {
    if (this.scenario.lab.isRunning()) {
      this.scenarioRoute = `${this.scenario.lab.frontUrl}/app/biox/scenario/${this.scenario.id}`;
    }
  }
}
