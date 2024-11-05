import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import { CaServerCloudTableComponent } from './component/ca-server-cloud-table/ca-server-cloud-table.component';
import { CaServerCloudFormDialogComponent } from './component/ca-server-cloud-form-dialog/ca-server-cloud-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaSelectDiskTypeOptionsComponent } from './component/ca-select-disk-type-options/ca-select-disk-type-options.component';
import { CaSelectServerCloudOptionsComponent } from './component/ca-select-server-cloud-options/ca-select-server-cloud-options.component';
import { CaServerCloudInlineComponent } from './component/ca-server-cloud-inline/ca-server-cloud-inline.component';
import { CaCloudProviderCoreModule } from '../ca-cloud-provider-core/ca-cloud-provider-core.module';
import { CaServerCloudSearchComponent } from './component/ca-server-cloud-search/ca-server-cloud-search.component';
import { CaServerCloudSearchFormComponent } from './component/ca-server-cloud-search-form/ca-server-cloud-search-form.component';
import { CaSpaceCoreModule } from '../ca-space-core/ca-space-core.module';
import { CaServerStandardPriceComponent } from './component/ca-server-standard-price/ca-server-standard-price.component';
import { CaServerStandardTableComponent } from './component/ca-server-standard-table/ca-server-standard-table.component';
import { CaServerStandardFormDialogComponent } from './component/ca-server-standard-form-dialog/ca-server-standard-form-dialog.component';
import { CaConfigCoreModule } from '../ca-config-core/ca-config-core.module';
import { CaServerPriceTableComponent } from './component/ca-server-price-table/ca-server-price-table.component';
import { CaServerPricesDialogComponent } from './component/ca-server-prices-dialog/ca-server-prices-dialog.component';
import { CaServerPriceFormDialogComponent } from './component/ca-server-price-form-dialog/ca-server-price-form-dialog.component';
import { CaServerDecisionTreeComponent } from './component/ca-server-decision-tree/ca-server-decision-tree.component';
import { CaSelectServerStandardOptionsComponent } from './component/ca-select-server-standard-options/ca-select-server-standard-options.component';
import { CaStoragePriceTableComponent } from './component/ca-storage-price-table/ca-storage-price-table.component';
import { CaStoragePricesDialogComponent } from './component/ca-storage-prices-dialog/ca-storage-prices-dialog.component';
import { CaStoragePriceFormDialogComponent } from './component/ca-storage-price-form-dialog/ca-storage-price-form-dialog.component';
import { CaSelectServerCloudComponent } from './component/ca-select-server-cloud/ca-select-server-cloud.component';
import { CaSelectServerCloudDialogComponent } from './component/ca-select-server-cloud-dialog/ca-select-server-cloud-dialog.component';

@NgModule({
  declarations: [
    CaServerCloudTableComponent,
    CaServerCloudFormDialogComponent,
    CaSelectDiskTypeOptionsComponent,
    CaSelectServerCloudOptionsComponent,
    CaServerCloudInlineComponent,
    CaServerCloudSearchComponent,
    CaServerCloudSearchFormComponent,
    CaServerStandardPriceComponent,
    CaServerStandardTableComponent,
    CaServerStandardFormDialogComponent,
    CaServerPriceTableComponent,
    CaServerPricesDialogComponent,
    CaServerPriceFormDialogComponent,
    CaServerDecisionTreeComponent,
    CaSelectServerStandardOptionsComponent,
    CaStoragePriceTableComponent,
    CaStoragePricesDialogComponent,
    CaStoragePriceFormDialogComponent,
    CaSelectServerCloudComponent,
    CaSelectServerCloudDialogComponent,
  ],
  exports: [
    CaServerCloudTableComponent,
    CaServerCloudFormDialogComponent,
    CaSelectDiskTypeOptionsComponent,
    CaSelectServerCloudOptionsComponent,
    CaServerCloudInlineComponent,
    CaServerCloudSearchComponent,
    CaServerCloudSearchFormComponent,
    CaServerStandardPriceComponent,
    CaServerStandardTableComponent,
    CaServerStandardFormDialogComponent,
    CaServerPriceTableComponent,
    CaServerPricesDialogComponent,
    CaServerPriceFormDialogComponent,
    CaServerDecisionTreeComponent,
    CaSelectServerStandardOptionsComponent,
    CaStoragePriceTableComponent,
    CaStoragePricesDialogComponent,
    CaStoragePriceFormDialogComponent,
    CaSelectServerCloudComponent,
    CaSelectServerCloudDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    CaCoreModule,
    CaCloudProviderCoreModule,
    CaSpaceCoreModule,
    CaConfigCoreModule,
    NgOptimizedImage,
  ],
})
export class CaServerCoreModule {}
