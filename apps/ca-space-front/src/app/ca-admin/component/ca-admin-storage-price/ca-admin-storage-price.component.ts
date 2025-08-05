import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaStoragePricesDialogComponent } from '../../../ca-core/entity-module/ca-server-core/component/ca-storage-prices-dialog/ca-storage-prices-dialog.component';
import { CaStoragePrice } from '../../../ca-core/model/entities/server/ca-storage-price.class';
import { CaServerService } from '../../../ca-core/service-api/ca-server.service';

@Component({
  selector: 'ca-admin-storage-price',
  templateUrl: './ca-admin-storage-price.component.html',
  styleUrl: './ca-admin-storage-price.component.scss',
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    FlSectionModule,
    FlKeyValueModule,
    TranslatePipe,
  ],
})
export class CaAdminStoragePriceComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  currentPrice$: Observable<CaStoragePrice> = this.serverService.getStorageCurrentPriceDetail();

  openPricesDialog(): void {
    this.dialogService
      .openMediumDialog(CaStoragePricesDialogComponent, { autoFocus: false })
      .afterClosed()
      .subscribe(() => (this.currentPrice$ = this.serverService.getStorageCurrentPriceDetail()));
  }
}
