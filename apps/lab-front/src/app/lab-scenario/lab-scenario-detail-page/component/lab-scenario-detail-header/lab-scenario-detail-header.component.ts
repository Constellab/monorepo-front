import { Component, inject, Injector, OnInit } from '@angular/core';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';

import { Observable } from 'rxjs';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import {
  LabScenarioIconsComponent,
} from '../../../../lab-core/entity-module/lab-scenario-core/component/lab-scenario-icons/lab-scenario-icons.component';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import {
  LabSyncObjectButtonComponent,
} from '../../../../lab-core/entity-module/lab-entity-core/component/lab-sync-object-button/lab-sync-object-button.component';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { AsyncPipe, NgClass } from '@angular/common';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  LabScenarioDetailActionMenu,
} from '../../../../lab-core/entity-module/lab-scenario-core/model/lab-scenario-detail-action-menu';
import { MatMenuModule } from '@angular/material/menu';

/**
 * Header for the scenario detail page
 */
@Component({
  selector: 'lab-scenario-detail-header',
  templateUrl: './lab-scenario-detail-header.component.html',
  styleUrls: ['./lab-scenario-detail-header.component.scss'],
  imports: [
    LabScenarioIconsComponent,
    FlFormModule,
    LabSyncObjectButtonComponent,
    FlStatusModule,
    FlIconModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    NgClass,
    MatMenuModule,
  ],
})
export class LabScenarioDetailHeaderComponent implements OnInit {
  private scenarioState = inject(LabScenarioDetailPageState);
  private scenarioService = inject(LabScenarioService);
  private injector = inject(Injector);

  scenario$: Observable<LabScenario>;

  syncObjectFunc: (id: string) => Observable<LabScenario>;

  ngOnInit(): void {
    this.scenario$ = this.scenarioState.getScenario$();
    this.syncObjectFunc = (id: string) => this.scenarioService.syncWithSpace(id);
  }

  updateTitle(title: string): void {
    this.scenarioService
      .updateTitle(this.scenarioState.currentScenario.id, title)
      .subscribe((scenario) => this.onScenarioUpdate(scenario));
  }

  onScenarioUpdate(scenario?: LabScenario): void {
    if (scenario) {
      this.scenarioState.updateScenario(scenario);
    }
  }

  openActionMenu(scenario: LabScenario, event: MouseEvent): void {
    const actionMenu = this.getActionMenu(scenario);

    actionMenu.openActionMenuDetail(event).subscribe();
  }

  openProgressInformation(scenario: LabScenario): void {
    if (scenario.isDraft()) return;
    const actionMenu = this.getActionMenu(scenario);
    actionMenu.openProgressInformation();
  }

  private getActionMenu(scenario: LabScenario): LabScenarioDetailActionMenu {
    return new LabScenarioDetailActionMenu(this.injector, scenario, this.scenarioState.getTags$());
  }
}
