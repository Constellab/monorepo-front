import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  CaCreateServerPriceDTO,
  CaServerPrice,
} from '../../../../model/entities/server/ca-server-price.class';

export interface CaServerPriceFormDialogInput extends FlFormDialogInput<CaCreateServerPriceDTO> {
  standardServerId: string;
}

@Component({
  selector: 'ca-server-price-form-dialog',
  templateUrl: './ca-server-price-form-dialog.component.html',
  styleUrl: './ca-server-price-form-dialog.component.scss',
  standalone: false,
})
export class CaServerPriceFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCreateServerPriceDTO, CaServerPrice>
  implements OnInit
{
  private serverService = inject(CaServerService);

  dialogInput: CaServerPriceFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      price: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, Validators.required],
    });
  }

  create(formValue: CaCreateServerPriceDTO): Observable<CaServerPrice> {
    return this.serverService.createServerPrice(this.dialogInput.standardServerId, formValue);
  }

  update(): Observable<CaServerPrice> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'server_price_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
