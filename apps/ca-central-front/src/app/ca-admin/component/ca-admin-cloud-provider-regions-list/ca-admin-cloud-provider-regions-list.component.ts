import { Component, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaAdminCloudProviderRegionFormDialogComponent,
  CaCloudProviderRegionFormDialogInput,
} from '../ca-admin-cloud-provider-region-form-dialog/ca-admin-cloud-provider-region-form-dialog.component';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource,
} from '../../../ca-core/model/entities/ca-cloud-provider.class';

@Component({
  selector: 'ca-admin-bucket-regions-list',
  templateUrl: './ca-admin-cloud-provider-regions-list.component.html',
  styleUrls: ['./ca-admin-cloud-provider-regions-list.component.scss'],
  standalone: false,
})
export class CaAdminCloudProviderRegionsListComponent {
  private cloudProviderService = inject(CaCloudProviderService);
  private dialogService = inject(FlDialogService);

  regions: CaCloudProviderRegionDatasource = this.cloudProviderService.getAllRegionsDatasource();

  openCreateDialog(): void {
    const input: CaCloudProviderRegionFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaAdminCloudProviderRegionFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((region) => this.onCreateClosed(region));
  }

  private onCreateClosed(region?: CaCloudProviderRegion): void {
    if (region) {
      this.regions.addItem(region);
    }
  }
}
