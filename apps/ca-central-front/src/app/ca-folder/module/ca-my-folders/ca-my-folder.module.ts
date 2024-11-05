import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaMyFoldersPageComponent } from './ca-my-folders-page/ca-my-folders-page.component';
import { CaMyFolderRoutingModule } from './ca-my-folder-routing.module';
import { CaHierarchyObjectCoreModule } from '../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';

/**
 * Modules for the 'My folders' page
 */
@NgModule({
  declarations: [CaMyFoldersPageComponent],
  imports: [CommonModule, CaCoreModule, CaHierarchyObjectCoreModule, CaMyFolderRoutingModule],
})
export class CaMyFolderModule {}
