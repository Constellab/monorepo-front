import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaCoreModule} from '../../ca-core.module';
import {
  CaBucketCredentialsListComponent
} from './component/ca-bucket-credentials-list/ca-bucket-credentials-list.component';
import {
  CaBucketCredentialsFormDialogComponent
} from './component/ca-bucket-credentials-form-dialog/ca-bucket-credentials-form-dialog.component';
import {
  CaBucketCredentialsTableComponent
} from './component/ca-bucket-credentials-table/ca-bucket-credentials-table.component';
import {CaCloudProviderCoreModule} from '../ca-cloud-provider-core/ca-cloud-provider-core.module';
import {CaSpaceCoreModule} from '../ca-space-core/ca-space-core.module';


@NgModule({
  declarations: [
    CaBucketCredentialsListComponent,
    CaBucketCredentialsFormDialogComponent,
    CaBucketCredentialsTableComponent,
  ],
  exports: [
    CaBucketCredentialsListComponent,
    CaBucketCredentialsFormDialogComponent,
    CaBucketCredentialsTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaCloudProviderCoreModule,
    CaSpaceCoreModule,
  ]
})
export class CaBucketCredentialsCoreModule {
}
