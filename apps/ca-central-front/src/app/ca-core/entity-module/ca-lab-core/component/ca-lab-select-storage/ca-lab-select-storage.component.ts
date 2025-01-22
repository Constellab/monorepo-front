import { Component, inject, Input, OnInit } from '@angular/core';
import { share } from 'rxjs';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FlGlobalValidators } from '@monorepo/front-core-lib';
import { CaStoragePrice } from '../../../../model/entities/server/ca-storage-price.class';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { MatMiniFabButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaLabSelectVolumeForm {
  storageSize: FormControl<number>;
  storagePrice: FormControl<number>;
}

@Component({
  selector: 'ca-lab-select-storage',
  templateUrl: './ca-lab-select-storage.component.html',
  styleUrl: './ca-lab-select-storage.component.scss',
  imports: [
    FlTextIconModule,
    MatIcon,
    FlKeyValueModule,
    MatMiniFabButton,
    FlLoaderModule,
    AsyncPipe,
    DecimalPipe,
    TranslatePipe,
  ],
})
export class CaLabSelectStorageComponent implements OnInit {
  @Input({ required: true }) formGp: FormGroup<CaLabSelectVolumeForm>;

  private serverService = inject(CaServerService);

  storagePrice$ = this.serverService.getStorageCurrentPriceDetail().pipe(share());

  readonly MIN_STORAGE_SIZE = 100;
  readonly MAX_STORAGE_SIZE = 4000;

  backupApproximateRatio = CaStoragePrice.backupApproximateRatio * 100;

  public static createFormGp(): FormGroup<CaLabSelectVolumeForm> {
    return new FormBuilder().group({
      storageSize: [100, [Validators.required, FlGlobalValidators.isInteger, Validators.min(100)]],
      storagePrice: [0],
    });
  }

  ngOnInit(): void {
    this.storagePrice$.subscribe((price) =>
      this.formGp.get('storagePrice').patchValue(price.totalApproximatePrice)
    );
  }

  reduceStorageSize(): void {
    let storagePrice = this.formGp.get('storageSize').value;
    if (storagePrice <= this.MIN_STORAGE_SIZE) {
      return;
    } else if (storagePrice <= 1000) {
      storagePrice -= 50;
    } else {
      storagePrice -= 100;
    }
    this.formGp.get('storageSize').setValue(storagePrice);
  }

  increaseStorageSize(): void {
    let storagePrice = this.formGp.get('storageSize').value;
    if (storagePrice >= this.MAX_STORAGE_SIZE) {
      return;
    } else if (storagePrice >= 1000) {
      storagePrice += 100;
    } else {
      storagePrice += 50;
    }
    this.formGp.get('storageSize').setValue(storagePrice);
  }
}
