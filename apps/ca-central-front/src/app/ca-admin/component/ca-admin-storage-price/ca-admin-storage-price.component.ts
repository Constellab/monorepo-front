import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {CaServerService} from '../../../ca-core/service-api/ca-server.service';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaStoragePricesDialogComponent
} from '../../../ca-core/entity-module/ca-server-core/component/ca-storage-prices-dialog/ca-storage-prices-dialog.component';

@Component({
  selector: 'ca-admin-storage-price',
  templateUrl: './ca-admin-storage-price.component.html',
  styleUrl: './ca-admin-storage-price.component.scss'
})
export class CaAdminStoragePriceComponent {

  currentPrice$: Observable<number> = this.serverService.getStorageCurrentPrice();

  constructor(private serverService: CaServerService,
              private dialogService: FlDialogService) {
  }

  openPricesDialog(): void {
    this.dialogService.openMediumDialog(CaStoragePricesDialogComponent).afterClosed().subscribe(
      () => this.currentPrice$ = this.serverService.getStorageCurrentPrice()
    );
  }
}
