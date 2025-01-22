import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaServerService } from '../../../ca-core/service-api/ca-server.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaStoragePricesDialogComponent } from '../../../ca-core/entity-module/ca-server-core/component/ca-storage-prices-dialog/ca-storage-prices-dialog.component';
import { CaStoragePrice } from '../../../ca-core/model/entities/server/ca-storage-price.class';
import { FlCardModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlSectionModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { TranslatePipe } from '@ngx-translate/core';

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
