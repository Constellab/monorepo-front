import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  CaCreateStoragePriceDTO,
  CaStoragePrice,
} from '../../../../model/entities/server/ca-storage-price.class';

@Component({
    selector: 'ca-storage-price-form-dialog',
    templateUrl: './ca-storage-price-form-dialog.component.html',
    styleUrl: './ca-storage-price-form-dialog.component.scss',
    standalone: false
})
export class CaStoragePriceFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCreateStoragePriceDTO, CaStoragePrice>
  implements OnInit
{
  constructor(private serverService: CaServerService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      volumeStoragePrice: [null, [Validators.required, Validators.min(0)]],
      backupStoragePrice: [null, [Validators.required, Validators.min(0)]],
      backupTransfertPrice: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, Validators.required],
    });
  }

  create(formValue: CaCreateStoragePriceDTO): Observable<CaStoragePrice> {
    return this.serverService.createStoragePrice(formValue);
  }

  update(): Observable<CaStoragePrice> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'storage_price_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
