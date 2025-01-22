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
import { FlCardModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CaAdminCloudProviderRegionTableComponent } from '../ca-admin-cloud-provider-region-table/ca-admin-cloud-provider-region-table.component';
import { TranslatePipe } from '@ngx-translate/core';

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
