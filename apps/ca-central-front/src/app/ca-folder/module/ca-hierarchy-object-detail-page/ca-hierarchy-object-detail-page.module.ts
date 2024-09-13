import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaHierarchyObjectDetailPageRoutingModule} from './ca-hierarchy-object-detail-page-routing.module';
import {CaFolderDetailPageModule} from '../ca-folder-detail-page/ca-folder-detail-page.module';
import {CaExperimentDetailPageModule} from '../ca-experiment-detail-page/ca-experiment-detail-page.module';
import {CaReportDetailPageModule} from '../ca-report-detail-page/ca-report-detail-page.module';
import {
  CaHierarchyObjectDetailPageComponent
} from './component/ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page.component';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {CaFolderHierarchyCoreModule} from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import {RouterModule} from '@angular/router';
import {CaHierarchyObjectTreeComponent} from './component/ca-hierarchy-object-tree/ca-hierarchy-object-tree.component';
import {CaFolderCoreModule} from '../../../ca-core/entity-module/ca-folder-core/ca-folder-core.module';
import {CaDocumentDetailPageModule} from '../ca-document-detail-page/ca-document-detail-page.module';
import {CaFolderActivityPageModule} from '../ca-folder-activity-page/ca-folder-activity-page.module';
import {
  CaHierarchyObjectCoreModule
} from '../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';

@NgModule({
  declarations: [
    CaHierarchyObjectDetailPageComponent,
    CaHierarchyObjectTreeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaFolderCoreModule,
    CaHierarchyObjectCoreModule,
    CaFolderDetailPageModule,
    CaExperimentDetailPageModule,
    CaReportDetailPageModule,
    CaFolderHierarchyCoreModule,
    CaDocumentDetailPageModule,
    CaFolderActivityPageModule,

    CaHierarchyObjectDetailPageRoutingModule,
  ]
})
export class CaHierarchyObjectDetailPageModule {
}
