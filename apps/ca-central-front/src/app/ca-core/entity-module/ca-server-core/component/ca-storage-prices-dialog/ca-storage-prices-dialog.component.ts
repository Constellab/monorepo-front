import {Component} from '@angular/core';
import {CaServerService} from '../../../../service-api/ca-server.service';
import {FlDialogService, FlEntityArrayObs, FlFormDialogInput} from '@monorepo/front-core-lib';
import {
  CaStoragePriceFormDialogComponent
} from '../ca-storage-price-form-dialog/ca-storage-price-form-dialog.component';
import {CaStoragePrice, CaStoragePriceDatasource} from '../../../../model/entities/server/ca-storage-price.class';

@Component({
  selector: 'ca-storage-prices-dialog',
  templateUrl: './ca-storage-prices-dialog.component.html',
  styleUrl: './ca-storage-prices-dialog.component.scss'
})
export class CaStoragePricesDialogComponent {

  prices: CaStoragePriceDatasource;

  constructor(private serverService: CaServerService,
              private dialogService: FlDialogService) {
    this.refreshPrices();
  }

  refreshPrices(): void {
    this.prices = new FlEntityArrayObs(this.serverService.getStorageAllPrices());
  }

  createPrice(): void {
    const input: FlFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openSmallDialog(CaStoragePriceFormDialogComponent, {data: input}).afterClosed().subscribe(
      (price) => this.onCreateClosed(price)
    );
  }

  private onCreateClosed(price?: CaStoragePrice): void {
    if (price) {
      this.refreshPrices();
    }
  }

}
