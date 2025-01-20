import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { first } from 'rxjs/operators';
import { PrWorkflowActionState } from '@monorepo/protocol';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import { LabWorkflowFactory } from '../../model/lab-workflow.factory';

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
    standalone: false
})
export class LabScenarioDetailPageComponent implements OnInit, OnDestroy {
  scenario$: Observable<LabScenario>;

  selectedTabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scenarioState: LabScenarioDetailPageState,
    private actionState: PrWorkflowActionState,
    private nodeDetailState: LabWorkflowNodeDetailState
  ) {}

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
