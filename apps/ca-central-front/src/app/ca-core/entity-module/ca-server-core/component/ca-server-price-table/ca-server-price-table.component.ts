import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerPrice,
  CaServerPriceDatasource,
} from '../../../../model/entities/server/ca-server-price.class';

@Component({
  selector: 'ca-server-price-table',
  templateUrl: './ca-server-price-table.component.html',
  styleUrl: './ca-server-price-table.component.scss',
  standalone: false,
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
