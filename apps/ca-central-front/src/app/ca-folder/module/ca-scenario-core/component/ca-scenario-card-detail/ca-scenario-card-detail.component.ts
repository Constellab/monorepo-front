import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaLabHelper } from '../../../../../ca-core/utils/ca-lab.helper';

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
      this.scenarioRoute = CaLabHelper.getScenarioUrl(this.scenario.lab.frontUrl, this.scenario.id);
    }
  }
}
