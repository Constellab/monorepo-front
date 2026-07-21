import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, Injector, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiScenario, LiScenarioService } from '@monorepo/lab-lib/li-core';
import { LiSyncObjectButtonComponent } from '@monorepo/lab-lib/li-entity';
import { LiScenarioIconsComponent } from '@monorepo/lab-lib/li-scenario';
import { Observable } from 'rxjs';

import { LabScenarioDetailActionMenu } from '../../model/lab-scenario-detail-action-menu';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';

/**
 * Header for the scenario detail page
 */
@Component({
  selector: 'lab-scenario-detail-header',
  templateUrl: './lab-scenario-detail-header.component.html',
  styleUrls: ['./lab-scenario-detail-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LiScenarioIconsComponent,
    FlFormModule,
    LiSyncObjectButtonComponent,
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
  private scenarioService = inject(LiScenarioService);
  private injector = inject(Injector);

  scenario$: Observable<LiScenario>;

  syncObjectFunc: (id: string) => Observable<LiScenario>;

  ngOnInit(): void {
    this.scenario$ = this.scenarioState.getScenario$();
    this.syncObjectFunc = (id: string) => this.scenarioService.syncWithSpace(id);
  }

  updateTitle(title: string): void {
    this.scenarioService
      .updateTitle(this.scenarioState.currentScenario.id, title)
      .subscribe((scenario) => this.onScenarioUpdate(scenario));
  }

  onScenarioUpdate(scenario?: LiScenario): void {
    if (scenario) {
      this.scenarioState.updateScenario(scenario);
    }
  }

  openActionMenu(scenario: LiScenario, event: MouseEvent): void {
    const actionMenu = this.getActionMenu(scenario);

    actionMenu.openActionMenuDetail(event).subscribe();
  }

  openProgressInformation(scenario: LiScenario): void {
    if (scenario.isDraft()) return;
    const actionMenu = this.getActionMenu(scenario);
    actionMenu.openProgressInformation();
  }

  private getActionMenu(scenario: LiScenario): LabScenarioDetailActionMenu {
    return new LabScenarioDetailActionMenu(this.injector, scenario, this.scenarioState);
  }
}
