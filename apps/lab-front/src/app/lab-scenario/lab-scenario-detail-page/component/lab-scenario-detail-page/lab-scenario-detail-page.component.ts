import { ChangeDetectionStrategy,Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiScenario } from '@monorepo/lab-lib/li-core';
import { PrWorkflowActionState } from '@monorepo/protocol';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { LabWorkflowFactory } from '../../model/lab-workflow.factory';
import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import { LabScenarioDetailComponent } from '../lab-scenario-detail/lab-scenario-detail.component';
import { LabScenarioDetailHeaderComponent } from '../lab-scenario-detail-header/lab-scenario-detail-header.component';
import { LabWorkflowComponent } from '../lab-workflow/lab-workflow.component';

/**
 * Page for the biox scenario detail with workflow view/edit
 */
@Component({
  selector: 'lab-scenario-detail-page',
  templateUrl: './lab-scenario-detail-page.component.html',
  styleUrls: ['./lab-scenario-detail-page.component.scss'],
  providers: [
    LabScenarioDetailPageState,
    LabWorkflowNodeDetailState,
    LabWorkflowEditConfig,
    LabWorkflowFactory,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSectionModule,
    LabScenarioDetailHeaderComponent,
    MatTabGroup,
    MatTab,
    MatTabContent,
    LabWorkflowComponent,
    LabScenarioDetailComponent,
    TranslatePipe,
  ],
})
export class LabScenarioDetailPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scenarioState = inject(LabScenarioDetailPageState);
  private actionState = inject(PrWorkflowActionState);
  private nodeDetailState = inject(LabWorkflowNodeDetailState);

  scenario$: Observable<LiScenario>;

  selectedTabIndex: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params.id));

    // init the tab base on query param
    this.route.queryParams
      .pipe(first())
      .subscribe((queryParams) => (this.selectedTabIndex = queryParams.tab ?? 0));

    this.actionState.init();
    this.nodeDetailState.init();
  }

  private init(scenarioId: string): void {
    this.scenarioState.init(scenarioId);
    this.scenario$ = this.scenarioState.getScenario$();
  }

  // on tab change, update the query param
  tabIndexChange(index: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  ngOnDestroy(): void {
    this.scenarioState.clear();
    this.actionState.clear();
  }
}
