import { Component, Input, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource,
} from '../../../ca-core/model/entities/ca-cloud-provider.class';
import {
  CaAdminCloudProviderRegionFormDialogComponent,
  CaCloudProviderRegionFormDialogInput,
} from '../ca-admin-cloud-provider-region-form-dialog/ca-admin-cloud-provider-region-form-dialog.component';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { CaCloudProviderInlineComponent } from '../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { CaCityComponent } from '../../../ca-core/entity-module/ca-config-core/component/ca-city/ca-city.component';
import { FlUserModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-admin-bucket-region-table',
  templateUrl: './ca-admin-cloud-provider-region-table.component.html',
  styleUrls: ['./ca-admin-cloud-provider-region-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    CaCloudProviderInlineComponent,
    CaCityComponent,
    FlUserModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaAdminCloudProviderRegionTableComponent {
  private cloudProviderService = inject(CaCloudProviderService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: CaCloudProviderRegionDatasource;

  @Input() columns: FlTableColumnStatic<CaCloudProviderRegion>[] = [
    'name',
    'type',
    'cloudProvider',
    'city',
    'lastModified',
    'actions',
  ];

  updateRegion(region: CaCloudProviderRegion): void {
    const input: CaCloudProviderRegionFormDialogInput = {
      mode: 'update',
      object: region,
    };

    this.dialogService
      .openSmallDialog(CaAdminCloudProviderRegionFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((region) => this.onUpdateClosed(region));
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
      observable: this.cloudProviderService.deleteRegion(region.id),
      successMessage: 'cloud_provider_region_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, region));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, region: CaCloudProviderRegion): void {
    if (result.choice) {
      this.datasource.removeItem(region);
    }
  }
}
