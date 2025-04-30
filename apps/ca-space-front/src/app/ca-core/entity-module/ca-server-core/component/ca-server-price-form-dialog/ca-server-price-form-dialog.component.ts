import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  CaCreateServerPriceDTO,
  CaServerPrice,
} from '../../../../model/entities/server/ca-server-price.class';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaServerPriceFormDialogInput extends FlFormDialogInput<CaCreateServerPriceDTO> {
  standardServerId: string;
}

@Component({
  selector: 'ca-server-price-form-dialog',
  templateUrl: './ca-server-price-form-dialog.component.html',
  styleUrl: './ca-server-price-form-dialog.component.scss',
  imports: [
    FlDialogModule,
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
