import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaProjectFormDialogComponent } from './component/ca-project-form-dialog/ca-project-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaCoreModule } from '../../ca-core.module';
import { RouterModule } from '@angular/router';
import { CaProjectTableComponent } from './component/ca-project-table/ca-project-table.component';
import {
  CaUpdateProjectLeaderDialogComponent
} from './component/ca-update-project-leader-dialog/ca-update-project-leader-dialog.component';
import { CaProjectInlineComponent } from './component/ca-project-inline/ca-project-inline.component';
import { CaProjectActionsMenuComponent } from './component/ca-project-actions-menu/ca-project-actions-menu.component';
import { CaProjectIconComponent } from './component/ca-project-icon/ca-project-icon.component';
import { CaProjectSearchComponent } from './component/ca-project-search/ca-project-search.component';
import { CaProjectSearchFormComponent } from './component/ca-project-search-form/ca-project-search-form.component';
import { CaStatusModule } from '../../module/ca-status/ca-status.module';
import { CaNotificationCoreModule } from '../ca-notification-core/ca-notification-core.module';
import { CaObjectStorageCoreModule } from '../ca-object-storage-core/ca-object-storage-core.module';
import {
  CaProjectStorageUsageComponent
} from './component/ca-project-storage-usage/ca-project-storage-usage.component';
import {
  CaProjectStorageLocationUsageComponent
} from './component/ca-project-storage-location-usage/ca-project-storage-location-usage.component';

/**
 * Importable module to get project components and pipe
 */
@NgModule({
  declarations: [
    // Component
    CaProjectFormDialogComponent,
    CaProjectTableComponent,
    CaUpdateProjectLeaderDialogComponent,
    CaProjectInlineComponent,
    CaProjectActionsMenuComponent,
    CaProjectIconComponent,
    CaProjectSearchComponent,
    CaProjectSearchFormComponent,
    CaProjectStorageUsageComponent,
    CaProjectStorageLocationUsageComponent
  ],
  exports: [
    // Component
    CaProjectFormDialogComponent,
    CaProjectTableComponent,
    CaUpdateProjectLeaderDialogComponent,
    CaProjectInlineComponent,
    CaProjectActionsMenuComponent,
    CaProjectIconComponent,
    CaProjectSearchComponent,
    CaProjectSearchFormComponent,
    CaProjectStorageUsageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    CaCoreModule,
    CaStatusModule,
    CaNotificationCoreModule,
    CaObjectStorageCoreModule
  ]
})
export class CaProjectCoreModule {
}
