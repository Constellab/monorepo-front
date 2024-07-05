import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CaSelectBucketCredentialsOptionsComponent
} from './component/ca-select-bucket-credentials-options/ca-select-bucket-credentials-options.component';
import {
  CaBucketCredentialsInlineComponent
} from './component/ca-bucket-credentials-inline/ca-bucket-credentials-inline.component';
import {
  CaBucketLocationSelectOptionsComponent
} from './component/ca-bucket-location-select-options/ca-bucket-location-select-options.component';
import {
  CaBucketLocationInlineComponent
} from './component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { CaCloudProviderCoreModule } from '../ca-cloud-provider-core/ca-cloud-provider-core.module';

@NgModule({
  declarations: [
    CaSelectBucketCredentialsOptionsComponent,
    CaBucketCredentialsInlineComponent,
    CaBucketLocationSelectOptionsComponent,
    CaBucketLocationInlineComponent,
  ],
  exports: [
    CaSelectBucketCredentialsOptionsComponent,
    CaBucketCredentialsInlineComponent,
    CaBucketLocationSelectOptionsComponent,
    CaBucketLocationInlineComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CaCoreModule, CaCloudProviderCoreModule]
})
export class CaObjectStorageCoreModule {}
