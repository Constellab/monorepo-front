import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaReportDetailPageComponent} from './component/ca-report-detail-page/ca-report-detail-page.component';
import {CaReportDetailComponent} from './component/ca-report-detail/ca-report-detail.component';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CaExperimentCoreModule} from '../ca-experiment-core/ca-experiment-core.module';
import {CaFolderHierarchyCoreModule} from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import {CaReportCoreModule} from '../ca-report-core/ca-report-core.module';


@NgModule({
  declarations: [
    CaReportDetailPageComponent,
    CaReportDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaExperimentCoreModule,
    CaReportCoreModule,
  ]
})
export class CaReportDetailPageModule {
}
