import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LabExperimentDetailPageState} from '../../state/lab-experiment-detail-page.state';
import {Observable, of} from 'rxjs';
import {PrWorkflow, PrWorkflowMode} from '@monorepo/protocol';
import {LabWorkflowEditConfig} from '../../model/lab-workflow-edit-config.class';
import {LabWorkflowNodeMenuConfig} from '../../model/lab-workflow-node-menu.config';
import {FlDialogService} from '@monorepo/front-core-lib';
import {first} from 'rxjs/operators';


@Component({
  selector: 'lab-workflow',
  templateUrl: './lab-workflow.component.html',
  styleUrls: ['./lab-workflow.component.scss'],
})
export class LabWorkflowComponent implements OnInit, AfterViewInit {

  workflowIsLoading: boolean = true;
  error: boolean = false;

  workflow: PrWorkflow;
  mode$: Observable<PrWorkflowMode> = of('edit');

  viewConfig: LabWorkflowNodeMenuConfig;

  constructor(private experimentState: LabExperimentDetailPageState,
              private dialogService: FlDialogService,
              private editConfig: LabWorkflowEditConfig) {
  }

  ngOnInit(): void {
    this.viewConfig = new LabWorkflowNodeMenuConfig(this.dialogService, this.editConfig);
  }


  ngAfterViewInit(): void {
    setTimeout(() => this.loadExperimentFlow(), 0);
  }

  private loadExperimentFlow(): void {
    // wait for the main protocol to be loaded
    this.experimentState.isReady$().pipe(first()).subscribe({
      next: () => this.loadExperimentFlowSuccess(),
      error: () => this.onError()
    });
  }

  private loadExperimentFlowSuccess(): void {
    this.workflow = this.experimentState.workflow;
    this.editConfig.init(this.workflow);
    this.workflowIsLoading = false;
  }

  private onError(): void {
    this.workflowIsLoading = false;
    this.error = true;
  }

}
