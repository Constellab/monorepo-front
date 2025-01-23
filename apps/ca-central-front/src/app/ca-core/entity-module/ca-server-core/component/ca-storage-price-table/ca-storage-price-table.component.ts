import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FlConfirmDialogInput } from '@monorepo/front-core-lib/fl-dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaStoragePrice,
  CaStoragePriceDatasource,
} from '../../../../model/entities/server/ca-storage-price.class';
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
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-storage-price-table',
  templateUrl: './ca-storage-price-table.component.html',
  styleUrl: './ca-storage-price-table.component.scss',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
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
    FlDateModule,
  ],
})
export class CaStoragePriceTableComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: CaStoragePriceDatasource;

  @Input() columns: FlTableColumnStatic<CaStoragePrice>[] = [
    'volumeStoragePrice',
    'backupStoragePrice',
    'backupTransfertPrice',
    'dates',
    'lastModified',
    'actions',
  ];

  @Output() priceDeleted: EventEmitter<CaStoragePrice> = new EventEmitter<CaStoragePrice>();

  deletePrice(price: CaStoragePrice): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_storage_price',
      content: 'delete_storage_price_confirm',
      observable: this.serverService.deleteStoragePrice(price.id),
      successMessage: 'storage_price_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, price));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, price: CaStoragePrice): void {
    if (result.choice) {
      this.priceDeleted.emit(price);
    }
  }
}
