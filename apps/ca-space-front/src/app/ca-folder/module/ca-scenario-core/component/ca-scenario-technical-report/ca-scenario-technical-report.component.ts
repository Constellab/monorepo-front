import { Component, inject, input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  PrProcessInfoDialogComponent,
  PrProcessInfoDialogInput,
  PrProtocol,
  PrProtocolModule,
  PrWorkflow,
  PrWorkflowActionSelectNode,
  PrWorkflowActionShowResource,
  PrWorkflowActionState,
  PrWorkflowFactory,
  PrWorkflowMode,
  PrWorkflowNodeProcess,
  PrWorkflowResourcesState,
} from '@monorepo/protocol';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput,
} from '../../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CaRootFolderUserRoleObj } from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaTechnicalReport } from '../../../../../ca-core/model/entities/folder/ca-technical-report.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import { CaWorkflowNodeMenuConfig } from '../../model/ca-workflow-node-menu.config';
import { CaScenarioTechnicalReportGraphComponent } from '../ca-scenario-technical-report-graph/ca-scenario-technical-report-graph.component';

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

  scenario = input.required<CaScenario>();
  userRole = input.required<CaRootFolderUserRoleObj>();

  technicalReport: CaTechnicalReport;

  workflow: PrWorkflow;

  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

  workflowConfig: CaWorkflowNodeMenuConfig;

  private factory: PrWorkflowFactory;

  private subscriptions: ClSubscriptionHandler = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.scenarioService
      .getScenarioTechnicalReport(this.scenario().id)
      .subscribe((res: CaTechnicalReport) => this.onTechnicalReportSuccess(res));

    this.workflowConfig = new CaWorkflowNodeMenuConfig(this.scenario().lab, this.snackBarService);
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
      labConfig: this.scenarioService.getScenarioLabConfig(this.scenario().id),
      title: { text: 'lab_configuration', translateText: true },
      helpText: { text: 'scenario_brick_config_help', translateText: true },
      showDetailButton: this.userRole().canEdit(),
      labId: this.scenario().lab?.id,
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
