import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaLabHelper } from '../../../../../ca-core/utils/ca-lab.helper';

/**
 * Detail card of the scenario used in the scenario page
 */
@Component({
    selector: 'ca-scenario-card-detail',
    templateUrl: './ca-scenario-card-detail.component.html',
    styleUrls: ['./ca-scenario-card-detail.component.scss'],
    standalone: false
})
export class CaScenarioCardDetailComponent {
  scenario = input.required<CaScenario>();

  @Input() showCardHeader: boolean = true;

  @Output() update: EventEmitter<CaScenario> = new EventEmitter<CaScenario>();

  scenarioRoute = computed(() => {
    if (this.scenario().lab.isRunning()) {
      return CaLabHelper.getScenarioUrl(this.scenario().lab.frontUrl, this.scenario().id);
    }
    return null;
  });
}
