import { Component, inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
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
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { PrProtocolModule } from '@monorepo/protocol';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-template-workflow',
  templateUrl: './lab-scenario-template-workflow.component.html',
  styleUrl: './lab-scenario-template-workflow.component.scss',
  imports: [FlTextIconModule, MatIcon, FlSectionModule, PrProtocolModule, TranslatePipe],
})
export class LabScenarioTemplateWorkflowComponent implements OnInit, OnDestroy {
  private actionState = inject(PrWorkflowActionState);
  private ngZone = inject(NgZone);
  private workflowResourcesState = inject(PrWorkflowResourcesState);
  private scenarioTemplateService = inject(LabScenarioTemplateService);

  @Input() template: LabScenarioTemplate;

  viewConfig = new PrWorkflowNodeMenuConfigEmpty();

  workflowIsLoading: boolean = false;
  workflow: PrWorkflow;
  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

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
