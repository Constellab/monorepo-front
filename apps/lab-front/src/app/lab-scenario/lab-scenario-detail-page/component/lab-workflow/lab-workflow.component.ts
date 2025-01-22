import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { Observable, of } from 'rxjs';
import { PrWorkflow, PrWorkflowMode } from '@monorepo/protocol';
import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import { LabWorkflowNodeMenuConfig } from '../../model/lab-workflow-node-menu.config';
import { FlDialogService } from '@monorepo/front-core-lib';
import { first } from 'rxjs/operators';
import { PrProtocolModule } from '../../../../../../../../libs/protocol/src/lib/pr-protocol.module';
import { LabWorkflowActionsComponent } from '../lab-workflow-actions/lab-workflow-actions.component';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCoreComponentModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-component/fl-core-component.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-workflow',
  templateUrl: './lab-workflow.component.html',
  styleUrls: ['./lab-workflow.component.scss'],
  imports: [
    PrProtocolModule,
    LabWorkflowActionsComponent,
    FlLoaderModule,
    FlCoreComponentModule,
    TranslatePipe,
  ],
})
export class LabWorkflowComponent implements OnInit, AfterViewInit {
  private scenarioState = inject(LabScenarioDetailPageState);
  private dialogService = inject(FlDialogService);
  private editConfig = inject(LabWorkflowEditConfig);

  workflowIsLoading: boolean = true;
  error: boolean = false;

  workflow: PrWorkflow;
  mode$: Observable<PrWorkflowMode> = of('edit');

  viewConfig: LabWorkflowNodeMenuConfig;

  ngOnInit(): void {
    this.viewConfig = new LabWorkflowNodeMenuConfig(this.dialogService, this.editConfig);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loadScenarioFlow(), 0);
  }

  private loadScenarioFlow(): void {
    // wait for the main protocol to be loaded
    this.scenarioState
      .isReady$()
      .pipe(first())
      .subscribe({
        next: () => this.loadScenarioFlowSuccess(),
        error: () => this.onError(),
      });
  }

  private loadScenarioFlowSuccess(): void {
    this.workflow = this.scenarioState.workflow;
    this.editConfig.init(this.workflow);
    this.workflowIsLoading = false;
  }

  private onError(): void {
    this.workflowIsLoading = false;
    this.error = true;
  }
}
