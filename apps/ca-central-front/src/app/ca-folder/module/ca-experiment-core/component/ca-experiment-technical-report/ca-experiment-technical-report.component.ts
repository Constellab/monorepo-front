import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CaExperiment } from '../../../../../ca-core/model/entities/folder/ca-experiment.class';
import { CaExperimentService } from '../../../../../ca-core/service-api/ca-experiment.service';
import { CaTechnicalReport } from '../../../../../ca-core/model/entities/folder/ca-technical-report.class';
import { FlDialogService, FlSnackBarService } from '@monorepo/front-core-lib';
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
  PrWorkflowResourcesState
} from '@monorepo/protocol';
import { filter, Observable, of } from 'rxjs';
import { CaWorkflowNodeMenuConfig } from '../../model/ca-workflow-node-menu.config';
import { ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { map } from 'rxjs/operators';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput
} from '../../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CoCommunityHelperService } from '@monorepo/community-lib';

@Component({
  selector: 'ca-experiment-technical-report',
  templateUrl: './ca-experiment-technical-report.component.html',
  styleUrls: ['./ca-experiment-technical-report.component.scss']
})
export class CaExperimentTechnicalReportComponent implements OnInit, OnDestroy {

  @Input() experiment: CaExperiment;

  technicalReport: CaTechnicalReport;

  workflow: PrWorkflow;

  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

  workflowConfig: CaWorkflowNodeMenuConfig;

  private factory: PrWorkflowFactory;

  private subscriptions: ClSubscriptionHandler = new ClSubscriptionHandler();


  constructor(private experimentService: CaExperimentService,
              private dialogService: FlDialogService,
              private actionState: PrWorkflowActionState,
              private ngZone: NgZone,
              private workflowResourcesState: PrWorkflowResourcesState,
              private snackBarService: FlSnackBarService,
              private communityHelper: CoCommunityHelperService) {
  }

  ngOnInit(): void {
    this.experimentService.getExperimentTechnicalReport(this.experiment.id).subscribe(
      (res: CaTechnicalReport) => this.onTechnicalReportSuccess(res)
    );

    this.workflowConfig = new CaWorkflowNodeMenuConfig(this.experiment.lab, this.snackBarService);
    this.actionState.init();


    this.subscriptions.add(this.actionState.getAction$().pipe(
      filter(action => action?.action === 'selectProcessNode'),
      map(action => (action as PrWorkflowActionSelectNode).processNode)
    ).subscribe((node: PrWorkflowNodeProcess) => this.openNodeDetail(node)));

    this.subscriptions.add(this.actionState.getAction$().pipe(
      filter(action => action?.action === 'showResource')
    ).subscribe((action: PrWorkflowActionShowResource) => this.navigateToResource(action.resourceId)));
  }

  private navigateToResource(resourceId: string): void {
    this.workflowConfig.openResourceDetail(resourceId);
  }

  openNodeDetail(workflowNode: PrWorkflowNodeProcess): void {
    const process: PrProtocol = this.factory.findCaProcessByPrProcessId(workflowNode.currentObject.id);
    if (workflowNode) {
      const input: PrProcessInfoDialogInput = {
        process: process,
        communityHelper: this.communityHelper
      };
      this.dialogService.openMediumDialog(PrProcessInfoDialogComponent, { data: input, autoFocus: false});
    }
  }

  openLabConfigDialog(): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.experimentService.getExperimentLabConfig(this.experiment.id),
      title: { text: 'lab_configuration', translateText: true },
      helpText: { text: 'experiment_brick_config_help', translateText: true }
    };

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, { data: input, autoFocus: false });
  }

  private onTechnicalReportSuccess(technicalReport: CaTechnicalReport): void {
    this.technicalReport = technicalReport;
    this.factory = new PrWorkflowFactory(technicalReport.data.graph, ClStringHelper.generateUUID(),
      this.ngZone, this.workflowResourcesState, this.actionState);
    this.workflow = this.factory.createWorkflow();
  }

  ngOnDestroy(): void {
    this.actionState.clear();
    this.workflow?.destroy();
    this.subscriptions?.unsubscribe();
  }
}


