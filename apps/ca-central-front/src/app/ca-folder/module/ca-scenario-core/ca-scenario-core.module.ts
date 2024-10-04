import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaLabCoreModule } from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { RouterModule } from '@angular/router';
import { CaScenarioInfoComponent } from './component/ca-scenario-info/ca-scenario-info.component';
import {
  CaScenarioTechnicalReportComponent
} from './component/ca-scenario-technical-report/ca-scenario-technical-report.component';
import {
  CaScenarioTechnicalReportGraphComponent
} from './component/ca-scenario-technical-report-graph/ca-scenario-technical-report-graph.component';
import {
  CaScenarioTechnicalReportLinkComponent
} from './component/ca-scenario-technical-report-link/ca-scenario-technical-report-link.component';
import {
  CaScenarioTechnicalReportIntOutComponent
} from './component/ca-scenario-technical-report-int-out/ca-scenario-technical-report-int-out.component';
import { CaScenarioTableComponent } from './component/ca-scenario-table/ca-scenario-table.component';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import { CaScenarioCardDetailComponent } from './component/ca-scenario-card-detail/ca-scenario-card-detail.component';
import {
  CaNotificationCoreModule
} from '../../../ca-core/entity-module/ca-notification-core/ca-notification-core.module';
import {
  CaScenarioTableDialogComponent
} from './component/ca-scenario-table-dialog/ca-scenario-table-dialog.component';

@NgModule({
  declarations: [
    CaScenarioInfoComponent,
    CaScenarioTechnicalReportComponent,
    CaScenarioTechnicalReportGraphComponent,
    CaScenarioTechnicalReportLinkComponent,
    CaScenarioTechnicalReportIntOutComponent,
    CaScenarioTableComponent,
    CaScenarioCardDetailComponent,
    CaScenarioTableDialogComponent
  ],
  exports: [
    CaScenarioInfoComponent,
    CaScenarioTechnicalReportComponent,
    CaScenarioCardDetailComponent,
    CaScenarioTableDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    CaCoreModule,
    CaLabCoreModule,
    CaFolderHierarchyCoreModule,
    CaNotificationCoreModule
  ]
})
export class CaScenarioCoreModule {
}
