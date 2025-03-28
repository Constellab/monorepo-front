import { ClStringHelper } from '@monorepo/core-lib';
import { Component, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiScenarioTemplate, LiScenarioTemplateService } from '@monorepo/lab-lib/li-core';
import { MatIcon } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import {
  PrProtocolGraph,
  PrProtocolModule,
  PrWorkflow,
  PrWorkflowActionState,
  PrWorkflowFactory,
  PrWorkflowMode,
  PrWorkflowNodeMenuConfigEmpty,
  PrWorkflowResourcesState,
} from '@monorepo/protocol';
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
  private scenarioTemplateService = inject(LiScenarioTemplateService);

  @Input() template: LiScenarioTemplate;

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
