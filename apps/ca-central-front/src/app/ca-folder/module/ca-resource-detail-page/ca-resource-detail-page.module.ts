import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaResourceDetailPageComponent } from './ca-resource-detail-page/ca-resource-detail-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import { CaLabCoreModule } from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { CaNoteCoreModule } from '../ca-note-core/ca-note-core.module';
import { CaScenarioCoreModule } from '../ca-scenario-core/ca-scenario-core.module';
import { CaHierarchyObjectCoreModule } from '../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';

@NgModule({
  declarations: [CaResourceDetailPageComponent],
  imports: [
    CommonModule,
    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaLabCoreModule,
    CaNoteCoreModule,
    CaScenarioCoreModule,
    CaHierarchyObjectCoreModule,
  ],
})
export class CaResourceDetailPageModule {}
