import {Component, Input} from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource
} from '../../../ca-core/model/entities/ca-cloud-provider.class';
import {
  CaAdminCloudProviderRegionFormDialogComponent,
  CaCloudProviderRegionFormDialogInput
} from '../ca-admin-cloud-provider-region-form-dialog/ca-admin-cloud-provider-region-form-dialog.component';
import {CaCloudProviderService} from '../../../ca-core/service-api/ca-cloud-provider.service';

@Component({
  selector: 'ca-admin-bucket-region-table',
  templateUrl: './ca-admin-cloud-provider-region-table.component.html',
  styleUrls: ['./ca-admin-cloud-provider-region-table.component.scss']
})
export class CaAdminCloudProviderRegionTableComponent {

  @Input() datasource: CaCloudProviderRegionDatasource;

  @Input() columns: FlTableColumnStatic<CaCloudProviderRegion>[] =
    ['technicalName', 'cloudProvider', 'city', 'space', 'lastModified', 'actions'];

  constructor(private cloudProviderService: CaCloudProviderService,
              private dialogService: FlDialogService) {
  }

  updateRegion(region: CaCloudProviderRegion): void {
    const input: CaCloudProviderRegionFormDialogInput = {
      mode: 'update',
      object: region
    };

    this.dialogService.openSmallDialog(CaAdminCloudProviderRegionFormDialogComponent, {data: input}).afterClosed().subscribe(
      region => this.onUpdateClosed(region)
    );
  }

  private onUpdateClosed(region?: CaCloudProviderRegion): void {
    if (region) {
      this.datasource.updateItem(region);
    }
  }

  deleteRegion(region: CaCloudProviderRegion): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_cloud_provider_region',
      content: 'delete_cloud_provider_region_confirm',
      translateTitleAndContent: true,
      observable: this.cloudProviderService.deleteRegion(region.id),
      successMessage: 'cloud_provider_region_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, region)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, region: CaCloudProviderRegion): void {
    if (result.choice) {
      this.datasource.removeItem(region);
    }
  }

}
