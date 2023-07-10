import {Component, computed, OnInit, Signal} from '@angular/core';
import {Observable} from 'rxjs';
import {LabWorkflowNodeDetailState} from '../../state/lab-workflow-node-detail.state';
import {FlDialogService} from '@monorepo/front-core-lib';
import {LabExperimentDetailPageState} from '../../state/lab-experiment-detail-page.state';
import {
  LabConfigureViewerDialogComponent,
  LabConfigureViewerDialogInput
} from '../lab-configure-viewer-dialog/lab-configure-viewer-dialog.component';
import {PrWorkflowNodeViewer} from '@monorepo/protocol';
import {TdTaskViewerConfig} from '@monorepo/technical-doc';

/**
 * Specific component to configure a task of type ViewTask
 *
 * This allows the user to configure the view
 */
@Component({
  selector: 'lab-task-viewer-config',
  templateUrl: './lab-task-viewer-config.component.html',
  styleUrls: ['./lab-task-viewer-config.component.scss']
})
export class LabTaskViewerConfigComponent implements OnInit {

  isEditable$: Observable<boolean>;

  node: Signal<PrWorkflowNodeViewer | null>;
  config: Signal<TdTaskViewerConfig>;

  constructor(private nodeDetail: LabWorkflowNodeDetailState,
              private dialogService: FlDialogService,
              private experimentState: LabExperimentDetailPageState) {
  }

  ngOnInit(): void {
    this.node = computed(() => {
      const node = this.nodeDetail.node2();
      if (node instanceof PrWorkflowNodeViewer) return node;
      return null;
    });

    this.config = computed(() => this.node()?.configValues())

    this.isEditable$ = this.experimentState.isEditable$();
  }


  openViewerConfiguration(node: PrWorkflowNodeViewer): void {
    const data: LabConfigureViewerDialogInput = node.configValues();

    this.dialogService.openMediumDialog(LabConfigureViewerDialogComponent,
      {data: data, panelClass: 'g-dialog-main-background'}).afterClosed().subscribe(
      resource => this.onConfigurationClosed(resource)
    );
  }

  private onConfigurationClosed(config?: TdTaskViewerConfig): void {
    if (config) {
      this.nodeDetail.updateConfigValues(config);
    }
  }


}
