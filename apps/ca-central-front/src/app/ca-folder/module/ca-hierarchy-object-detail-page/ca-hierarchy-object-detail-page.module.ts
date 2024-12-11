import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaHierarchyObjectDetailPageRoutingModule } from './ca-hierarchy-object-detail-page-routing.module';
import { CaFolderDetailPageModule } from '../ca-folder-detail-page/ca-folder-detail-page.module';
import { CaScenarioDetailPageModule } from '../ca-scenario-detail-page/ca-scenario-detail-page.module';
import { CaNoteDetailPageModule } from '../ca-note-detail-page/ca-note-detail-page.module';
import { CaHierarchyObjectDetailPageComponent } from './component/ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import { RouterModule } from '@angular/router';
import { CaFolderCoreModule } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-core.module';
import { CaDocumentDetailPageModule } from '../ca-document-detail-page/ca-document-detail-page.module';
import { CaFolderActivityPageModule } from '../ca-folder-activity-page/ca-folder-activity-page.module';
import { CaHierarchyObjectCoreModule } from '../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';
import { CaResourceDetailPageModule } from '../ca-resource-detail-page/ca-resource-detail-page.module';

@NgModule({
  declarations: [CaHierarchyObjectDetailPageComponent],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaFolderCoreModule,
    CaHierarchyObjectCoreModule,
    CaFolderDetailPageModule,
    CaScenarioDetailPageModule,
    CaNoteDetailPageModule,
    CaFolderHierarchyCoreModule,
    CaDocumentDetailPageModule,
    CaFolderActivityPageModule,
    CaResourceDetailPageModule,

    CaHierarchyObjectDetailPageRoutingModule,
  ],
})
export class CaHierarchyObjectDetailPageModule {}
