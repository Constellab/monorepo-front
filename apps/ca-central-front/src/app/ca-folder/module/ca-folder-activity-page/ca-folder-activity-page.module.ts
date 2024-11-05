import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaFolderActivityPageComponent } from './component/ca-folder-activity-page/ca-folder-activity-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaActivityCoreModule } from '../../../ca-core/entity-module/ca-activity-core/ca-activity-core.module';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';

@NgModule({
  declarations: [CaFolderActivityPageComponent],
  imports: [CommonModule, CaCoreModule, CaActivityCoreModule, CaFolderHierarchyCoreModule],
})
export class CaFolderActivityPageModule {}
