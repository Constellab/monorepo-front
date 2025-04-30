import { Component, inject, Input } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import {
  CaCloudProvider,
  CaCloudProviderDatasource,
} from '../../../../model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import {
  CaCloudProviderFormDialogComponent,
  CaCloudProviderFormDialogInput,
} from '../ca-cloud-provider-form-dialog/ca-cloud-provider-form-dialog.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CaCloudProviderInlineComponent } from '../ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-cloud-provider-table',
  templateUrl: './ca-cloud-provider-table.component.html',
  styleUrls: ['./ca-cloud-provider-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    CaCloudProviderInlineComponent,
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
export class CaCloudProviderTableComponent {
  private cloudProviderService = inject(CaCloudProviderService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: CaCloudProviderDatasource;

  @Input() columns: FlTableColumnStatic<CaCloudProvider>[] = [
    'name',
    'description',
    'created',
    'lastModified',
    'actions',
  ];

  updateCloudProvider(cloudProvider: CaCloudProvider): void {
    const input: CaCloudProviderFormDialogInput = {
      mode: 'update',
      object: cloudProvider,
    };

    this.dialogService
      .openSmallDialog(CaCloudProviderFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((cloudProvider) => this.onUpdateClosed(cloudProvider));
  }

  private onUpdateClosed(cloudProvider?: CaCloudProvider): void {
    if (cloudProvider) {
      this.datasource.updateItem(cloudProvider);
    }
  }

  deleteCloudProvider(cloudProvider: CaCloudProvider): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_cloud_provider',
      content: 'delete_cloud_provider_confirm',
      observable: this.cloudProviderService.delete(cloudProvider.id),
      successMessage: 'cloud_provider_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, cloudProvider));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, cloudProvider: CaCloudProvider): void {
    if (result.choice) {
      this.datasource.removeItem(cloudProvider);
    }
  }
}
