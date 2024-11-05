import { Component, OnInit } from '@angular/core';
import { CaScenarioService } from '../../../ca-core/service-api/ca-scenario.service';
import { CaScenario } from '../../../ca-core/model/entities/folder/ca-scenario.class';

@Component({
  selector: 'ca-dashboard-last-scenarios',
  templateUrl: './ca-dashboard-last-scenarios.component.html',
  styleUrls: ['./ca-dashboard-last-scenarios.component.scss'],
})
export class CaDashboardLastScenariosComponent implements OnInit {
  lastScenarios: CaScenario[];

  constructor(private scenarioService: CaScenarioService) {}

  ngOnInit(): void {
    this.scenarioService
      .findCurrentUserLastScenarios()
      .subscribe((res: CaScenario[]) => (this.lastScenarios = res));
  }
}
