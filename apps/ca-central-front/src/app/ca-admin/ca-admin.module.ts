import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../ca-core/ca-core.module';
import { CaAdminRoutingModule } from './ca-admin-routing.module';
import { CaServerCoreModule } from '../ca-core/entity-module/ca-server-core/ca-server-core.module';
import { CaLabCoreModule } from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { CaSpaceCoreModule } from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import { CaAdminOthersPageComponent } from './component/ca-admin-others-page/ca-admin-others-page.component';
import { CaAdminPageComponent } from './component/ca-admin-page/ca-admin-page.component';
import { CaAdminCloudProvidersListComponent } from './component/ca-admin-cloud-providers-list/ca-admin-cloud-providers-list.component';
import { CaCloudProviderCoreModule } from '../ca-core/entity-module/ca-cloud-provider-core/ca-cloud-provider-core.module';
import { CaObjectStorageCoreModule } from '../ca-core/entity-module/ca-object-storage-core/ca-object-storage-core.module';
import { CaAdminCloudProviderRegionsListComponent } from './component/ca-admin-cloud-provider-regions-list/ca-admin-cloud-provider-regions-list.component';
import { CaAdminSpacesPageComponent } from './component/ca-admin-spaces-page/ca-admin-spaces-page.component';
import { CaAdminUsersPageComponent } from './component/ca-admin-users-page/ca-admin-users-page.component';
import { CaAdminLabsPageComponent } from './component/ca-admin-labs-page/ca-admin-labs-page.component';
import { CaUserCoreModule } from '../ca-core/entity-module/ca-user-core/ca-user-core.module';
import { CaAdminBucketsPageComponent } from './component/ca-admin-buckets-page/ca-admin-buckets-page.component';
import { CaAdminServerPageComponent } from './component/ca-admin-server-page/ca-admin-server-page.component';
import { CaAdminCloudProviderRegionFormDialogComponent } from './component/ca-admin-cloud-provider-region-form-dialog/ca-admin-cloud-provider-region-form-dialog.component';
import { CaAdminCloudProviderRegionTableComponent } from './component/ca-admin-cloud-provider-region-table/ca-admin-cloud-provider-region-table.component';
import { CaConfigCoreModule } from '../ca-core/entity-module/ca-config-core/ca-config-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaBucketFormDialogComponent } from './component/bucket/ca-bucket-form-dialog/ca-bucket-form-dialog.component';
import { CaBucketTableComponent } from './component/bucket/ca-bucket-table/ca-bucket-table.component';
import { CaBucketSearchComponent } from './component/bucket/ca-bucket-search/ca-bucket-search.component';
import { CaBucketSearchFormComponent } from './component/bucket/ca-bucket-search-form/ca-bucket-search-form.component';
import { CaBucketCredentialsCoreModule } from '../ca-core/entity-module/ca-bucket-credentials-core/ca-bucket-credentials-core.module';
import { CaAdminServerStandardListComponent } from './component/ca-admin-server-standard-list/ca-admin-server-standard-list.component';
import { CaAdminStoragePriceComponent } from './component/ca-admin-storage-price/ca-admin-storage-price.component';

/**
 * Module only accessible by the admins
 */
@NgModule({
  declarations: [
    CaAdminOthersPageComponent,
    CaAdminPageComponent,
    CaAdminCloudProvidersListComponent,
    CaAdminCloudProviderRegionsListComponent,
    CaAdminSpacesPageComponent,
    CaAdminUsersPageComponent,
    CaAdminLabsPageComponent,
    CaAdminBucketsPageComponent,
    CaAdminServerPageComponent,
    CaAdminCloudProviderRegionFormDialogComponent,
    CaAdminCloudProviderRegionTableComponent,

    CaBucketFormDialogComponent,
    CaBucketTableComponent,
    CaBucketSearchComponent,
    CaBucketSearchFormComponent,
    CaAdminServerStandardListComponent,
    CaAdminStoragePriceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaServerCoreModule,
    CaLabCoreModule,
    CaSpaceCoreModule,
    CaCloudProviderCoreModule,
    CaObjectStorageCoreModule,
    CaUserCoreModule,
    CaConfigCoreModule,
    CaBucketCredentialsCoreModule,

    CaAdminRoutingModule,
  ],
  exports: [CaAdminUsersPageComponent],
})
export class CaAdminModule {}
