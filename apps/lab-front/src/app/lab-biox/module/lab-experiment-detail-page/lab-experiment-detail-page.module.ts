import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabCoreModule} from '../../../lab-core/lab-core.module';
import {
  LabExperimentDetailPageComponent
} from './component/lab-experiment-detail-page/lab-experiment-detail-page.component';
import {LabExperimentCoreModule} from '../../../lab-core/entity-module/lab-experiment-core/lab-experiment-core.module';
import {LabWorkflowComponent} from './component/lab-workflow/lab-workflow.component';
import {LabResourceCoreModule} from '../../../lab-core/entity-module/lab-resource-core/lab-resource-core.module';
import {LabConfigCoreModule} from '../../../lab-core/entity-module/lab-config-core/lab-config-core.module';
import {LabWorkflowActionsComponent} from './component/lab-workflow-actions/lab-workflow-actions.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  LabExperimentDetailHeaderComponent
} from './component/lab-experiment-detail-header/lab-experiment-detail-header.component';
import {LabExperimentDetailComponent} from './component/lab-experiment-detail/lab-experiment-detail.component';
import {
  LabExperimentLinkedReportsComponent
} from './component/lab-experiment-linked-reports/lab-experiment-linked-reports.component';
import {RouterModule} from '@angular/router';
import {LabTypeCoreModule} from '../../../lab-core/entity-module/lab-type-core/lab-type-core.module';
import {
  LabConfigureProtocolDialogComponent
} from './component/lab-configure-protocol-dialog/lab-configure-protocol-dialog.component';
import {LabConfigureProtocolComponent} from './component/lab-configure-protocol/lab-configure-protocol.component';
import {LabConfigureProcessComponent} from './component/lab-configure-process/lab-configure-process.component';
import {LabConfigureTaskComponent} from './component/lab-configure-task/lab-configure-task.component';
import {LabEntityCoreModule} from '../../../lab-core/entity-module/lab-entity-core/lab-entity-core.module';
import {LabReportCoreModule} from '../../../lab-core/entity-module/lab-report-core/lab-report-core.module';
import {LabLogCoreModule} from '../../../lab-core/entity-module/lab-log-core/lab-log-core.module';
import {LabMonitorCoreModule} from '../../../lab-core/entity-module/lab-monitor-core/lab-monitor-core.module';
import {
  LabProgressBarCoreModule
} from '../../../lab-core/entity-module/lab-progress-bar-core/lab-progress-bar-core.module';
import {LabProjectCoreModule} from '../../../lab-core/entity-module/lab-project-core/lab-project-core.module';
import {
  LabWorkflowNodeDashboardComponent
} from './component/lab-workflow-node-dashboard/lab-workflow-node-dashboard.component';
import {
  LabWorkflowNodeIoPanelComponent
} from './component/lab-workflow-node-io-panel/lab-workflow-node-io-panel.component';
import {
  LabProtocolTemplateCoreModule
} from '../../../lab-core/entity-module/lab-protocol-template-core/lab-protocol-template-core.module';
import {
  LabDynamicPortConfigDialogComponent
} from './component/lab-dynamic-port-config-dialog/lab-dynamic-port-config-dialog.component';
import {LabTagCoreModule} from '../../../lab-core/entity-module/lab-tag-core/lab-tag-core.module';
import {
  LabNavigableEntityCoreModule
} from '../../../lab-core/entity-module/lab-navigable-entity-core/lab-navigable-entity-core.module';

@NgModule({
  declarations: [
    LabExperimentDetailPageComponent,
    LabWorkflowComponent,
    LabWorkflowActionsComponent,
    LabExperimentDetailHeaderComponent,
    LabExperimentDetailComponent,
    LabExperimentLinkedReportsComponent,
    LabConfigureProtocolDialogComponent,
    LabConfigureProtocolComponent,
    LabConfigureProcessComponent,
    LabConfigureTaskComponent,
    LabWorkflowNodeDashboardComponent,
    LabWorkflowNodeIoPanelComponent,
    LabDynamicPortConfigDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    LabCoreModule,
    LabExperimentCoreModule,
    LabResourceCoreModule,
    LabConfigCoreModule,
    LabEntityCoreModule,
    LabTypeCoreModule,
    LabReportCoreModule,
    LabLogCoreModule,
    LabMonitorCoreModule,
    LabProgressBarCoreModule,
    LabProjectCoreModule,
    LabProtocolTemplateCoreModule,
    LabTagCoreModule,
    LabNavigableEntityCoreModule,
  ],
})
export class LabExperimentDetailPageModule {
}
