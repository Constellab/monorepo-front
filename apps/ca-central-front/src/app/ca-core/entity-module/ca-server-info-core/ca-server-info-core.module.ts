import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaServerInfoDetailComponent} from './component/ca-server-info-detail/ca-server-info-detail.component';
import {CaCoreModule} from '../../ca-core.module';
import {CaServerInfoTableComponent} from './component/ca-server-info-table/ca-server-info-table.component';
import {
  CaServerInfoFormDialogComponent
} from './component/ca-server-info-form-dialog/ca-server-info-form-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CaSelectDiskTypeOptionsComponent
} from './component/ca-select-disk-type-options/ca-select-disk-type-options.component';
import {
  CaSelectServerInfoOptionsComponent
} from './component/ca-select-server-info-options/ca-select-server-info-options.component';
import {CaServerInfoInlineComponent} from './component/ca-server-info-inline/ca-server-info-inline.component';
import {CaCloudProviderCoreModule} from '../ca-cloud-provider-core/ca-cloud-provider-core.module';
import {CaServerInfoSearchComponent} from './component/ca-server-info-search/ca-server-info-search.component';
import {
  CaServerInfoSearchFormComponent
} from './component/ca-server-info-search-form/ca-server-info-search-form.component';
import {CaSpaceCoreModule} from '../ca-space-core/ca-space-core.module';
import {CaServerInfoPriceComponent} from './component/ca-server-info-price/ca-server-info-price.component';

@NgModule({
  declarations: [
    CaServerInfoDetailComponent,
    CaServerInfoTableComponent,
    CaServerInfoFormDialogComponent,
    CaSelectDiskTypeOptionsComponent,
    CaSelectServerInfoOptionsComponent,
    CaServerInfoInlineComponent,
    CaServerInfoSearchComponent,
    CaServerInfoSearchFormComponent,
    CaServerInfoPriceComponent,
  ],
  exports: [
    CaServerInfoDetailComponent,
    CaServerInfoTableComponent,
    CaServerInfoFormDialogComponent,
    CaSelectDiskTypeOptionsComponent,
    CaSelectServerInfoOptionsComponent,
    CaServerInfoInlineComponent,
    CaServerInfoSearchComponent,
    CaServerInfoSearchFormComponent,
    CaServerInfoPriceComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    CaCoreModule,
    CaCloudProviderCoreModule,
    CaSpaceCoreModule,
  ],
})
export class CaServerInfoCoreModule {
}
