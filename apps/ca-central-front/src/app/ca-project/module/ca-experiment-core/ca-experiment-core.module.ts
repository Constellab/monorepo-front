import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaLabCoreModule } from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { RouterModule } from '@angular/router';
import { CaExperimentInfoComponent } from './component/ca-experiment-info/ca-experiment-info.component';
import {
  CaExperimentTechnicalReportComponent
} from './component/ca-experiment-technical-report/ca-experiment-technical-report.component';
import {
  CaExperimentTechnicalReportGraphComponent
} from './component/ca-experiment-technical-report-graph/ca-experiment-technical-report-graph.component';
import {
  CaExperimentTechnicalReportLinkComponent
} from './component/ca-experiment-technical-report-link/ca-experiment-technical-report-link.component';
import {
  CaExperimentTechnicalReportIntOutComponent
} from './component/ca-experiment-technical-report-int-out/ca-experiment-technical-report-int-out.component';
import { CaExperimentTableComponent } from './component/ca-experiment-table/ca-experiment-table.component';
import { CaProjectObjectCoreModule } from '../ca-project-object-core/ca-project-object-core.module';
import {
  CaExperimentCardDetailComponent
} from './component/ca-experiment-card-detail/ca-experiment-card-detail.component';
import {
  CaNotificationCoreModule
} from '../../../ca-core/entity-module/ca-notification-core/ca-notification-core.module';
import {
  CaExperimentsTableDialogComponent
} from './component/ca-experiments-table-dialog/ca-experiments-table-dialog.component';

@NgModule({
  declarations: [
    CaExperimentInfoComponent,
    CaExperimentTechnicalReportComponent,
    CaExperimentTechnicalReportGraphComponent,
    CaExperimentTechnicalReportLinkComponent,
    CaExperimentTechnicalReportIntOutComponent,
    CaExperimentTableComponent,
    CaExperimentCardDetailComponent,
    CaExperimentsTableDialogComponent
  ],
  exports: [
    CaExperimentInfoComponent,
    CaExperimentTechnicalReportComponent,
    CaExperimentCardDetailComponent,
    CaExperimentsTableDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    CaCoreModule,
    CaLabCoreModule,
    CaProjectObjectCoreModule,
    CaNotificationCoreModule
  ]
})
export class CaExperimentCoreModule {
}
