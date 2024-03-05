import {Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {LabProtocolTemplate} from '../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import {
  PrConfigViewEmpty,
  PrProtocolGraph,
  PrWorkflow,
  PrWorkflowActionState,
  PrWorkflowFactory,
  PrWorkflowMode,
  PrWorkflowResourcesState
} from '@monorepo/protocol';
import {Observable, of} from 'rxjs';
import {LabProtocolTemplateService} from '../../../../lab-core/entity-service/lab-protocol-template.service';
import {ClStringHelper} from '@monorepo/core-lib';

@Component({
  selector: 'lab-protocol-template-workflow',
  templateUrl: './lab-protocol-template-workflow.component.html',
  styleUrl: './lab-protocol-template-workflow.component.scss'
})
export class LabProtocolTemplateWorkflowComponent implements OnInit, OnDestroy {

  @Input() template: LabProtocolTemplate;


  viewConfig = new PrConfigViewEmpty();

  workflowIsLoading: boolean = false;
  workflow: PrWorkflow;
  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

  constructor(private actionState: PrWorkflowActionState,
              private ngZone: NgZone,
              private workflowResourcesState: PrWorkflowResourcesState,
              private protocolTemplateService: LabProtocolTemplateService) {

  }

  ngOnInit(): void {
    this.actionState.init();
    this.getProtocolGraph();
  }

  private getProtocolGraph(): void {
    this.workflowIsLoading = true;
    this.protocolTemplateService.getProtocolTemplateGraph(this.template.id).subscribe({
      next: (protocolGraph: PrProtocolGraph) => this.getProtocolGraphSuccess(protocolGraph),
      error: () => this.workflowIsLoading = false
    });
  }

  private getProtocolGraphSuccess(protocolGraph: PrProtocolGraph): void {
    const factory = new PrWorkflowFactory(protocolGraph, ClStringHelper.generateUUID(),
      this.ngZone, this.workflowResourcesState, this.actionState);
    this.workflow = factory.createWorkflow();
    this.workflowIsLoading = false;
  }

  ngOnDestroy(): void {
    this.actionState.clear();
  }
}
