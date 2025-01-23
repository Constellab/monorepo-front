import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  CaCreateStoragePriceDTO,
  CaStoragePrice,
} from '../../../../model/entities/server/ca-storage-price.class';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-storage-price-form-dialog',
  templateUrl: './ca-storage-price-form-dialog.component.html',
  styleUrl: './ca-storage-price-form-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatError,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaStoragePriceFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCreateStoragePriceDTO, CaStoragePrice>
  implements OnInit
{
  private serverService = inject(CaServerService);

  constructor() {
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
