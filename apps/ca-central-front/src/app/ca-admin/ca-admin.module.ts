import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaCoreModule} from '../ca-core/ca-core.module';
import {CaAdminRoutingModule} from './ca-admin-routing.module';
import {CaServerInfoCoreModule} from '../ca-core/entity-module/ca-server-info-core/ca-server-info-core.module';
import {CaLabCoreModule} from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import {CaSpaceCoreModule} from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {CaAdminOthersPageComponent} from './component/ca-admin-others-page/ca-admin-others-page.component';
import {CaAdminPageComponent} from './component/ca-admin-page/ca-admin-page.component';
import {
  CaAdminCloudProvidersListComponent
} from './component/ca-admin-cloud-providers-list/ca-admin-cloud-providers-list.component';
import {CaCloudProviderCoreModule} from '../ca-core/entity-module/ca-cloud-provider-core/ca-cloud-provider-core.module';
import {
  CaAdminBucketCredentialsListComponent
} from './component/ca-admin-bucket-credentials-list/ca-admin-bucket-credentials-list.component';
import {CaObjectStorageCoreModule} from '../ca-core/entity-module/ca-object-storage-core/ca-object-storage-core.module';
import {
  CaAdminCloudProviderRegionsListComponent
} from './component/ca-admin-cloud-provider-regions-list/ca-admin-cloud-provider-regions-list.component';
import {CaAdminSpacesPageComponent} from './component/ca-admin-spaces-page/ca-admin-spaces-page.component';
import {CaAdminUsersPageComponent} from './component/ca-admin-users-page/ca-admin-users-page.component';
import {
  CaAdminLabInstancesPageComponent
} from './component/ca-admin-lab-instances-page/ca-admin-lab-instances-page.component';
import {CaUserCoreModule} from '../ca-core/entity-module/ca-user-core/ca-user-core.module';
import {CaAdminBucketsPageComponent} from './component/ca-admin-buckets-page/ca-admin-buckets-page.component';
import {
  CaAdminServerInfoPageComponent
} from './component/ca-admin-server-info-page/ca-admin-server-info-page.component';

/**
 * Module only accessible by the admins
 */
@NgModule({
  declarations: [
    CaAdminOthersPageComponent,
    CaAdminPageComponent,
    CaAdminCloudProvidersListComponent,
    CaAdminBucketCredentialsListComponent,
    CaAdminCloudProviderRegionsListComponent,
    CaAdminSpacesPageComponent,
    CaAdminUsersPageComponent,
    CaAdminLabInstancesPageComponent,
    CaAdminBucketsPageComponent,
    CaAdminServerInfoPageComponent,
  ],
  imports: [
    CommonModule,

    CaCoreModule,
    CaServerInfoCoreModule,
    CaLabCoreModule,
    CaSpaceCoreModule,
    CaCloudProviderCoreModule,
    CaObjectStorageCoreModule,
    CaUserCoreModule,

    CaAdminRoutingModule,
  ],
  exports: [CaAdminUsersPageComponent],
})
export class CaAdminModule {
}
