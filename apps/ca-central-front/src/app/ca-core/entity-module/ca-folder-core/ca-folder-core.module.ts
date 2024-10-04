import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaFolderFormDialogComponent } from './component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaCoreModule } from '../../ca-core.module';
import { RouterModule } from '@angular/router';
import { CaFolderTableComponent } from './component/ca-folder-table/ca-folder-table.component';
import {
  CaUpdateFolderLeaderDialogComponent
} from './component/ca-update-folder-leader-dialog/ca-update-folder-leader-dialog.component';
import { CaFolderInlineComponent } from './component/ca-folder-inline/ca-folder-inline.component';
import { CaFolderSearchComponent } from './component/ca-folder-search/ca-folder-search.component';
import { CaFolderSearchFormComponent } from './component/ca-folder-search-form/ca-folder-search-form.component';
import { CaStatusModule } from '../../module/ca-status/ca-status.module';
import { CaNotificationCoreModule } from '../ca-notification-core/ca-notification-core.module';
import { CaObjectStorageCoreModule } from '../ca-object-storage-core/ca-object-storage-core.module';
import { CaFolderStorageUsageComponent } from './component/ca-folder-storage-usage/ca-folder-storage-usage.component';
import {
  CaFolderStorageLocationUsageComponent
} from './component/ca-folder-storage-location-usage/ca-folder-storage-location-usage.component';
import { CaSelectFolderDialogComponent } from './component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaHierarchyObjectCoreModule } from '../ca-hierarchy-object-core/ca-hierarchy-object-core.module';

/**
 * Importable module to get folder components and pipe
 */
@NgModule({
  declarations: [
    CaFolderFormDialogComponent,
    CaFolderTableComponent,
    CaUpdateFolderLeaderDialogComponent,
    CaFolderInlineComponent,
    CaFolderSearchComponent,
    CaFolderSearchFormComponent,
    CaFolderStorageUsageComponent,
    CaFolderStorageLocationUsageComponent,
    CaSelectFolderDialogComponent
  ],
  exports: [
    CaFolderFormDialogComponent,
    CaFolderTableComponent,
    CaUpdateFolderLeaderDialogComponent,
    CaFolderInlineComponent,
    CaFolderSearchComponent,
    CaFolderSearchFormComponent,
    CaFolderStorageUsageComponent,
    CaSelectFolderDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    CaCoreModule,
    CaStatusModule,
    CaNotificationCoreModule,
    CaObjectStorageCoreModule,
    CaHierarchyObjectCoreModule
  ]
})
export class CaFolderCoreModule {
}
