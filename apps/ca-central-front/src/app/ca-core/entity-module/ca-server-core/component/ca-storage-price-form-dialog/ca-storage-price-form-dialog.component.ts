import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaServerService} from '../../../../service-api/ca-server.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaCreateStoragePriceDTO, CaStoragePrice} from '../../../../model/entities/server/ca-storage-price.class';

@Component({
  selector: 'ca-storage-price-form-dialog',
  templateUrl: './ca-storage-price-form-dialog.component.html',
  styleUrl: './ca-storage-price-form-dialog.component.scss'
})
export class CaStoragePriceFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCreateStoragePriceDTO, CaStoragePrice> implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) protected dialogInput: FlFormDialogInput,
              private serverService: CaServerService,
              protected snackBarService: FlSnackBarService,
              protected dialogRef: MatDialogRef<CaStoragePriceFormDialogComponent>) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaCreateStoragePriceDTO> {
    return new FormBuilder().group({
      price: [null, [Validators.required, Validators.min(0)]],
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
