import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import {
  LabScenarioDetailPageComponent
} from './component/lab-scenario-detail-page/lab-scenario-detail-page.component';
import { LabScenarioCoreModule } from '../../lab-core/entity-module/lab-scenario-core/lab-scenario-core.module';
import { LabWorkflowComponent } from './component/lab-workflow/lab-workflow.component';
import { LabResourceCoreModule } from '../../lab-core/entity-module/lab-resource-core/lab-resource-core.module';
import { LabConfigCoreModule } from '../../lab-core/entity-module/lab-config-core/lab-config-core.module';
import { LabWorkflowActionsComponent } from './component/lab-workflow-actions/lab-workflow-actions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LabScenarioDetailHeaderComponent
} from './component/lab-scenario-detail-header/lab-scenario-detail-header.component';
import { LabScenarioDetailComponent } from './component/lab-scenario-detail/lab-scenario-detail.component';
import {
  LabScenarioLinkedNotesComponent
} from './component/lab-scenario-linked-notes/lab-scenario-linked-notes.component';
import { RouterModule } from '@angular/router';
import { LabTypeCoreModule } from '../../lab-core/entity-module/lab-type-core/lab-type-core.module';
import {
  LabConfigureProtocolDialogComponent
} from './component/lab-configure-protocol-dialog/lab-configure-protocol-dialog.component';
import { LabConfigureProtocolComponent } from './component/lab-configure-protocol/lab-configure-protocol.component';
import { LabConfigureProcessComponent } from './component/lab-configure-process/lab-configure-process.component';
import { LabConfigureTaskComponent } from './component/lab-configure-task/lab-configure-task.component';
import { LabEntityCoreModule } from '../../lab-core/entity-module/lab-entity-core/lab-entity-core.module';
import { LabNoteCoreModule } from '../../lab-core/entity-module/lab-note-core/lab-note-core.module';
import { LabLogCoreModule } from '../../lab-core/entity-module/lab-log-core/lab-log-core.module';
import { LabMonitorCoreModule } from '../../lab-core/entity-module/lab-monitor-core/lab-monitor-core.module';
import {
  LabProgressBarCoreModule
} from '../../lab-core/entity-module/lab-progress-bar-core/lab-progress-bar-core.module';
import { LabFolderCoreModule } from '../../lab-core/entity-module/lab-folder-core/lab-folder-core.module';
import { LabProcessDashboardComponent } from './component/lab-process-dashboard/lab-process-dashboard.component';
import { LabProcessIoPanelComponent } from './component/lab-process-io-panel/lab-process-io-panel.component';
import {
  LabProtocolTemplateCoreModule
} from '../../lab-core/entity-module/lab-protocol-template-core/lab-protocol-template-core.module';
import {
  LabDynamicPortConfigDialogComponent
} from './component/lab-dynamic-port-config-dialog/lab-dynamic-port-config-dialog.component';
import { LabTagCoreModule } from '../../lab-core/entity-module/lab-tag-core/lab-tag-core.module';
import {
  LabNavigableEntityCoreModule
} from '../../lab-core/entity-module/lab-navigable-entity-core/lab-navigable-entity-core.module';
import {
  LabResourceNextObjectsPortalComponent
} from './component/lab-resource-next-objects-portal/lab-resource-next-objects-portal.component';
import { LabSystemCoreModule } from '../../lab-core/entity-module/lab-system-core/lab-system-core.module';

@NgModule({
  declarations: [
    LabScenarioDetailPageComponent,
    LabWorkflowComponent,
    LabWorkflowActionsComponent,
    LabScenarioDetailHeaderComponent,
    LabScenarioDetailComponent,
    LabScenarioLinkedNotesComponent,
    LabConfigureProtocolDialogComponent,
    LabConfigureProtocolComponent,
    LabConfigureProcessComponent,
    LabConfigureTaskComponent,
    LabProcessDashboardComponent,
    LabProcessIoPanelComponent,
    LabDynamicPortConfigDialogComponent,
    LabResourceNextObjectsPortalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    LabCoreModule,
    LabScenarioCoreModule,
    LabResourceCoreModule,
    LabConfigCoreModule,
    LabEntityCoreModule,
    LabTypeCoreModule,
    LabNoteCoreModule,
    LabLogCoreModule,
    LabMonitorCoreModule,
    LabProgressBarCoreModule,
    LabFolderCoreModule,
    LabProtocolTemplateCoreModule,
    LabTagCoreModule,
    LabNavigableEntityCoreModule,
    LabSystemCoreModule
  ]
})
export class LabScenarioDetailPageModule {
}
