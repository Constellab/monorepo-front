import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaProjectDetailPageRoutingModule} from './ca-project-object-detail-page-routing.module';
import {CaProjectDetailPageModule} from '../ca-project-detail-page/ca-project-detail-page.module';
import {CaExperimentDetailPageModule} from '../ca-experiment-detail-page/ca-experiment-detail-page.module';
import {CaReportDetailPageModule} from '../ca-report-detail-page/ca-report-detail-page.module';
import {
  CaProjectObjectDetailPageComponent
} from './component/ca-project-object-detail-page/ca-project-object-detail-page.component';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {CaProjectObjectCoreModule} from '../ca-project-object-core/ca-project-object-core.module';
import {RouterModule} from '@angular/router';
import {CaProjectObjectTreeComponent} from './component/ca-project-object-tree/ca-project-object-tree.component';
import {CaProjectCoreModule} from '../../../ca-core/entity-module/ca-project-core/ca-project-core.module';
import {CaDocumentDetailPageModule} from '../ca-document-detail-page/ca-document-detail-page.module';
import {CaProjectActivityPageModule} from '../ca-project-activity-page/ca-project-activity-page.module';
import { CaFolderCoreModule } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-core.module';

@NgModule({
  declarations: [
    CaProjectObjectDetailPageComponent,
    CaProjectObjectTreeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaProjectCoreModule,
    CaFolderCoreModule,
    CaProjectDetailPageModule,
    CaExperimentDetailPageModule,
    CaReportDetailPageModule,
    CaProjectObjectCoreModule,
    CaDocumentDetailPageModule,
    CaProjectActivityPageModule,

    CaProjectDetailPageRoutingModule,
  ]
})
export class CaProjectObjectDetailPageModule {
}
