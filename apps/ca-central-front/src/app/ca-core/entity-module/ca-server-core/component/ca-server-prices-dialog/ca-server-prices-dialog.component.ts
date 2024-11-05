import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaServerStandard } from '../../../../model/entities/server/ca-server-standard.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerPrice,
  CaServerPriceDatasource,
} from '../../../../model/entities/server/ca-server-price.class';
import { FlDialogService, FlEntityArrayObs } from '@monorepo/front-core-lib';
import {
  CaServerPriceFormDialogComponent,
  CaServerPriceFormDialogInput,
} from '../ca-server-price-form-dialog/ca-server-price-form-dialog.component';

@Component({
  selector: 'ca-server-prices-dialog',
  templateUrl: './ca-server-prices-dialog.component.html',
  styleUrl: './ca-server-prices-dialog.component.scss',
})
export class CaServerPricesDialogComponent {
  standardServer: CaServerStandard;

  prices: CaServerPriceDatasource;

  constructor(
    @Inject(MAT_DIALOG_DATA) standardServer: CaServerStandard,
    private serverService: CaServerService,
    private dialogService: FlDialogService
  ) {
    this.standardServer = standardServer;
    this.refreshPrices();
  }

  refreshPrices(): void {
    this.prices = new FlEntityArrayObs(this.serverService.getServerAllPrices(this.standardServer.id));
  }

  createPrice(): void {
    const input: CaServerPriceFormDialogInput = {
      standardServerId: this.standardServer.id,
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaServerPriceFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((price) => this.onCreateClosed(price));
  }

  private onCreateClosed(price?: CaServerPrice): void {
    if (price) {
      this.refreshPrices();
    }
  }
}
