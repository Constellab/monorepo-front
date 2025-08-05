import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource,
} from '../../../ca-core/model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';
import {
  CaAdminCloudProviderRegionFormDialogComponent,
  CaCloudProviderRegionFormDialogInput,
} from '../ca-admin-cloud-provider-region-form-dialog/ca-admin-cloud-provider-region-form-dialog.component';
import { CaAdminCloudProviderRegionTableComponent } from '../ca-admin-cloud-provider-region-table/ca-admin-cloud-provider-region-table.component';

@Component({
  selector: 'ca-admin-bucket-regions-list',
  templateUrl: './ca-admin-cloud-provider-regions-list.component.html',
  styleUrls: ['./ca-admin-cloud-provider-regions-list.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    CaAdminCloudProviderRegionTableComponent,
    TranslatePipe,
  ],
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
