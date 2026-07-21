import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaServerPrice,
  CaServerPriceDatasource,
} from '../../../../model/entities/server/ca-server-price.class';
import { CaServerStandard } from '../../../../model/entities/server/ca-server-standard.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerPriceFormDialogComponent,
  CaServerPriceFormDialogInput,
} from '../ca-server-price-form-dialog/ca-server-price-form-dialog.component';
import { CaServerPriceTableComponent } from '../ca-server-price-table/ca-server-price-table.component';

@Component({
  selector: 'ca-server-prices-dialog',
  templateUrl: './ca-server-prices-dialog.component.html',
  styleUrl: './ca-server-prices-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    CaServerPriceTableComponent,
    TranslatePipe,
  ],
})
export class CaServerPricesDialogComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  standardServer: CaServerStandard;

  prices: CaServerPriceDatasource;

  constructor() {
    const standardServer = inject<CaServerStandard>(MAT_DIALOG_DATA);

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
