import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerPrice,
  CaServerPriceDatasource,
} from '../../../../model/entities/server/ca-server-price.class';
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
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-server-price-table',
  templateUrl: './ca-server-price-table.component.html',
  styleUrl: './ca-server-price-table.component.scss',
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
export class CaServerPriceTableComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: CaServerPriceDatasource;

  @Input({ required: true }) serverStandardId: string;

  @Input() columns: FlTableColumnStatic<CaServerPrice>[] = [
    'price',
    'startDate',
    'endDate',
    'lastModified',
    'actions',
  ];

  @Output() priceDeleted: EventEmitter<CaServerPrice> = new EventEmitter<CaServerPrice>();

  deletePrice(price: CaServerPrice): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_server_price',
      content: 'delete_server_price_confirm',
      observable: this.serverService.deleteServerPrice(this.serverStandardId, price.id),
      successMessage: 'server_price_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, price));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, price: CaServerPrice): void {
    if (result.choice) {
      this.priceDeleted.emit(price);
    }
  }
}
