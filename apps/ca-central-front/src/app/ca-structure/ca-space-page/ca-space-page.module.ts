import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CaCurrentSpacePageComponent} from './component/ca-current-space-page/ca-current-space-page.component';
import {CaCoreModule} from '../../ca-core/ca-core.module';
import {CaSpaceCoreModule} from '../../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {CaCurrentSpaceDetailComponent} from './component/ca-current-space-detail/ca-current-space-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaGroupCoreModule} from '../../ca-core/entity-module/ca-group-core/ca-group-core.module';
import {
  CaSpaceUserRoleDialogComponent
} from './component/ca-space-user-role-dialog/ca-space-user-role-dialog.component';
import {CaSpaceInvitTableComponent} from './component/ca-space-invit-table/ca-space-invit-table.component';
import {
  CaSpaceInvitFormDialogComponent
} from './component/ca-space-invit-form-dialog/ca-space-invit-form-dialog.component';
import {
  CaCurrentSpaceInvitListComponent
} from './component/ca-current-space-invit-list/ca-current-space-invit-list.component';
import {CaLabCoreModule} from '../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import {CaFolderCoreModule} from '../../ca-core/entity-module/ca-folder-core/ca-folder-core.module';
import {CaRequestNewLicensesComponent} from './component/ca-request-new-licenses/ca-request-new-licenses.component';
import {RouterModule} from '@angular/router';
import {
  CaCurrentSpaceUsersPageComponent
} from './component/ca-current-space-users-page/ca-current-space-users-page.component';
import {
  CaCurrentSpaceDashboardPageComponent
} from './component/ca-current-space-dashboard-page/ca-current-space-dashboard-page.component';
import {
  CaCurrentSpaceLabInstancesPageComponent
} from './component/ca-current-space-lab-instances-page/ca-current-space-lab-instances-page.component';
import {
  CaCurrentSpaceFoldersPageComponent
} from './component/ca-current-space-folders-page/ca-current-space-folders-page.component';
import {
  CaCurrentSpaceTeamsPageComponent
} from './component/ca-current-space-teams-page/ca-current-space-teams-page.component';
import {
  CaCloudProviderCoreModule
} from '../../ca-core/entity-module/ca-cloud-provider-core/ca-cloud-provider-core.module';
import {
  CaObjectStorageCoreModule
} from '../../ca-core/entity-module/ca-object-storage-core/ca-object-storage-core.module';
import {
  CaCurrentSpaceOtherPageComponent
} from './component/ca-current-space-other-page/ca-current-space-other-page.component';
import {
  CaBucketCredentialsCoreModule
} from '../../ca-core/entity-module/ca-bucket-credentials-core/ca-bucket-credentials-core.module';
import {CaCurrentSpaceStorageComponent} from './component/ca-current-space-storage/ca-current-space-storage.component';
import {
  CaCurrentSpaceStorageDetailComponent
} from './component/ca-current-space-storage-detail/ca-current-space-storage-detail.component';
import {
  CaCurrentSpaceUpdateStorageDialogComponent
} from './component/ca-current-space-update-storage-dialog/ca-current-space-update-storage-dialog.component';


@NgModule({
  declarations: [
    CaCurrentSpacePageComponent,
    CaCurrentSpaceDetailComponent,
    CaSpaceUserRoleDialogComponent,
    CaSpaceInvitTableComponent,
    CaSpaceInvitFormDialogComponent,
    CaCurrentSpaceInvitListComponent,
    CaRequestNewLicensesComponent,
    CaCurrentSpaceUsersPageComponent,
    CaCurrentSpaceDashboardPageComponent,
    CaCurrentSpaceLabInstancesPageComponent,
    CaCurrentSpaceFoldersPageComponent,
    CaCurrentSpaceTeamsPageComponent,
    CaCurrentSpaceOtherPageComponent,
    CaCurrentSpaceStorageComponent,
    CaCurrentSpaceStorageDetailComponent,
    CaCurrentSpaceUpdateStorageDialogComponent,
  ],
  exports: [
    CaSpaceInvitFormDialogComponent,
    CaCurrentSpaceInvitListComponent,
    CaRequestNewLicensesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    CaCoreModule,
    CaSpaceCoreModule,
    CaGroupCoreModule,
    CaLabCoreModule,
    CaFolderCoreModule,
    CaCloudProviderCoreModule,
    CaObjectStorageCoreModule,
    CaBucketCredentialsCoreModule,
    NgOptimizedImage,
  ],
})
export class CaSpacePageModule {
}
