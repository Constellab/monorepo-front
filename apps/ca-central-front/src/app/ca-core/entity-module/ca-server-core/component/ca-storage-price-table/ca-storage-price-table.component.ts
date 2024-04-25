import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {CaServerService} from '../../../../service-api/ca-server.service';
import {CaStoragePrice, CaStoragePriceDatasource} from '../../../../model/entities/server/ca-storage-price.class';

@Component({
  selector: 'ca-storage-price-table',
  templateUrl: './ca-storage-price-table.component.html',
  styleUrl: './ca-storage-price-table.component.scss'
})
export class CaStoragePriceTableComponent {

  @Input({required: true}) datasource: CaStoragePriceDatasource;

  @Input() columns: FlTableColumnStatic<CaStoragePrice>[] =
    ['price', 'startDate', 'endDate', 'lastModified', 'actions'];

  @Output() priceDeleted: EventEmitter<CaStoragePrice> = new EventEmitter<CaStoragePrice>();

  constructor(private serverService: CaServerService,
              private dialogService: FlDialogService) {
  }

  deletePrice(price: CaStoragePrice): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_storage_price',
      content: 'delete_storage_price_confirm',
      translateTitleAndContent: true,
      observable: this.serverService.deleteStoragePrice(price.id),
      successMessage: 'storage_price_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, price)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, price: CaStoragePrice): void {
    if (result.choice) {
      this.priceDeleted.emit(price);
    }
  }
}
