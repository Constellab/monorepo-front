import { Component, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import { CaTechnicalReport } from '../../../../../ca-core/model/entities/folder/ca-technical-report.class';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  PrProcessInfoDialogComponent,
  PrProcessInfoDialogInput,
  PrProtocol,
  PrWorkflow,
  PrWorkflowActionSelectNode,
  PrWorkflowActionShowResource,
  PrWorkflowActionState,
  PrWorkflowFactory,
  PrWorkflowMode,
  PrWorkflowNodeProcess,
  PrWorkflowResourcesState,
} from '@monorepo/protocol';
import { filter, Observable, of } from 'rxjs';
import { CaWorkflowNodeMenuConfig } from '../../model/ca-workflow-node-menu.config';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { map } from 'rxjs/operators';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput,
} from '../../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatButton } from '@angular/material/button';
import { MatTabGroup, MatTab, MatTabContent } from '@angular/material/tabs';
import { PrProtocolModule } from '../../../../../../../../../libs/protocol/src/lib/pr-protocol.module';
import { CaScenarioTechnicalReportGraphComponent } from '../ca-scenario-technical-report-graph/ca-scenario-technical-report-graph.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-scenario-technical-report',
  templateUrl: './ca-scenario-technical-report.component.html',
  styleUrls: ['./ca-scenario-technical-report.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatButton,
    MatTabGroup,
    MatTab,
    MatTabContent,
    PrProtocolModule,
    CaScenarioTechnicalReportGraphComponent,
    TranslatePipe,
  ],
})
export class CaScenarioTechnicalReportComponent implements OnInit, OnDestroy {
  private scenarioService = inject(CaScenarioService);
  private dialogService = inject(FlDialogService);
  private actionState = inject(PrWorkflowActionState);
  private ngZone = inject(NgZone);
  private workflowResourcesState = inject(PrWorkflowResourcesState);
  private snackBarService = inject(FlSnackBarService);
  private communityHelper = inject(CoCommunityHelperService);

  @Input() scenario: CaScenario;

  technicalReport: CaTechnicalReport;

  workflow: PrWorkflow;

  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

  workflowConfig: CaWorkflowNodeMenuConfig;

  private factory: PrWorkflowFactory;

  private subscriptions: ClSubscriptionHandler = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.scenarioService
      .getScenarioTechnicalReport(this.scenario.id)
      .subscribe((res: CaTechnicalReport) => this.onTechnicalReportSuccess(res));

    this.workflowConfig = new CaWorkflowNodeMenuConfig(this.scenario.lab, this.snackBarService);
    this.actionState.init();

    this.subscriptions.add(
      this.actionState
        .getAction$()
        .pipe(
          filter((action) => action?.action === 'selectProcessNode'),
          map((action) => (action as PrWorkflowActionSelectNode).processNode)
        )
        .subscribe((node: PrWorkflowNodeProcess) => this.openNodeDetail(node))
    );

    this.subscriptions.add(
      this.actionState
        .getAction$()
        .pipe(filter((action) => action?.action === 'showResource'))
        .subscribe((action: PrWorkflowActionShowResource) => this.navigateToResource(action.resourceId))
    );
  }

  private navigateToResource(resourceId: string): void {
    this.workflowConfig.openResourceDetail(resourceId);
  }

  openNodeDetail(workflowNode: PrWorkflowNodeProcess): void {
    const process: PrProtocol = this.factory.findCaProcessByPrProcessId(workflowNode.currentObject.id);
    if (workflowNode) {
      const input: PrProcessInfoDialogInput = {
        process: process,
        communityHelper: this.communityHelper,
      };
      this.dialogService.openMediumDialog(PrProcessInfoDialogComponent, { data: input, autoFocus: false });
    }
  }

  openLabConfigDialog(): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.scenarioService.getScenarioLabConfig(this.scenario.id),
      title: { text: 'lab_configuration', translateText: true },
      helpText: { text: 'scenario_brick_config_help', translateText: true },
    };

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, { data: input, autoFocus: false });
  }

  private onTechnicalReportSuccess(technicalReport: CaTechnicalReport): void {
    this.technicalReport = technicalReport;
    this.factory = new PrWorkflowFactory(
      technicalReport.data.graph,
      ClStringHelper.generateUUID(),
      this.ngZone,
      this.workflowResourcesState,
      this.actionState
    );
    this.workflow = this.factory.createWorkflow();
  }

  ngOnDestroy(): void {
    this.actionState.clear();
    this.workflow?.destroy();
    this.subscriptions?.unsubscribe();
  }
}
