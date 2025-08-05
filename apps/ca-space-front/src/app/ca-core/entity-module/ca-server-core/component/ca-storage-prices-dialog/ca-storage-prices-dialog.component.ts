import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlEntityArrayObs, FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaStoragePrice,
  CaStoragePriceDatasource,
} from '../../../../model/entities/server/ca-storage-price.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaStoragePriceFormDialogComponent } from '../ca-storage-price-form-dialog/ca-storage-price-form-dialog.component';
import { CaStoragePriceTableComponent } from '../ca-storage-price-table/ca-storage-price-table.component';

@Component({
  selector: 'ca-storage-prices-dialog',
  templateUrl: './ca-storage-prices-dialog.component.html',
  styleUrl: './ca-storage-prices-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    CaStoragePriceTableComponent,
    TranslatePipe,
  ],
})
export class CaStoragePricesDialogComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  prices: CaStoragePriceDatasource;

  constructor() {
    this.refreshPrices();
  }

  refreshPrices(): void {
    this.prices = new FlEntityArrayObs(this.serverService.getStorageAllPrices());
  }

  createPrice(): void {
    const input: FlFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaStoragePriceFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((price) => this.onCreateClosed(price));
  }

  private onCreateClosed(price?: CaStoragePrice): void {
    if (price) {
      this.refreshPrices();
    }
  }
}
