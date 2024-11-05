import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { LabScenarioTemplate } from '../../../../lab-core/model/entities/process/lab-scenario-template.entity';
import {
  PrProtocolGraph,
  PrWorkflow,
  PrWorkflowActionState,
  PrWorkflowFactory,
  PrWorkflowMode,
  PrWorkflowNodeMenuConfigEmpty,
  PrWorkflowResourcesState,
} from '@monorepo/protocol';
import { Observable, of } from 'rxjs';
import { LabScenarioTemplateService } from '../../../../lab-core/entity-service/lab-scenario-template.service';
import { ClStringHelper } from '@monorepo/core-lib';

@Component({
  selector: 'lab-scenario-template-workflow',
  templateUrl: './lab-scenario-template-workflow.component.html',
  styleUrl: './lab-scenario-template-workflow.component.scss',
})
export class LabScenarioTemplateWorkflowComponent implements OnInit, OnDestroy {
  @Input() template: LabScenarioTemplate;

  viewConfig = new PrWorkflowNodeMenuConfigEmpty();

  workflowIsLoading: boolean = false;
  workflow: PrWorkflow;
  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

  constructor(
    private actionState: PrWorkflowActionState,
    private ngZone: NgZone,
    private workflowResourcesState: PrWorkflowResourcesState,
    private scenarioTemplateService: LabScenarioTemplateService
  ) {}

  ngOnInit(): void {
    this.actionState.init();
    this.getProtocolGraph();
  }

  private getProtocolGraph(): void {
    this.workflowIsLoading = true;
    this.scenarioTemplateService.getScenarioTemplateGraph(this.template.id).subscribe({
      next: (protocolGraph: PrProtocolGraph) => this.getProtocolGraphSuccess(protocolGraph),
      error: () => (this.workflowIsLoading = false),
    });
  }

  private getProtocolGraphSuccess(protocolGraph: PrProtocolGraph): void {
    const factory = new PrWorkflowFactory(
      protocolGraph,
      ClStringHelper.generateUUID(),
      this.ngZone,
      this.workflowResourcesState,
      this.actionState
    );
    this.workflow = factory.createWorkflow();
    this.workflowIsLoading = false;
  }

  ngOnDestroy(): void {
    this.actionState.clear();
  }
}
