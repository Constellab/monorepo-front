import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  CaServerStandard,
  CaServerStandardSaveDTO,
} from '../../../../model/entities/server/ca-server-standard.class';
import { CaServerService } from '../../../../service-api/ca-server.service';

export type CaServerStandardFormDialogInput = FlFormDialogInput<CaServerStandardSaveDTO>;

@Component({
  selector: 'ca-server-standard-form-dialog',
  templateUrl: './ca-server-standard-form-dialog.component.html',
  styleUrl: './ca-server-standard-form-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatHint,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaServerStandardFormDialogComponent
  extends FlFormDialogAbstractDirective<CaServerStandardSaveDTO, CaServerStandard>
  implements OnInit
{
  private serverService = inject(CaServerService);

  dialogInput: CaServerStandardFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    const formGp = new FormBuilder().group({
      id: [null],
      name: [null, Validators.required],
      description: [null, Validators.required],
      technicalDescription: [null, Validators.required],
      price: [null],
    });

    // price is only available in create mode
    if (this.isCreateMode()) {
      formGp.get('price').setValidators([Validators.required, Validators.min(0)]);
    }

    return formGp;
  }

  create(formValue: CaServerStandardSaveDTO): Observable<CaServerStandard> {
    return this.serverService.createServerStandard(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'server_standard_created';
  }

  getUpdateSuccessMessage(): string {
    return 'server_standard_updated';
  }

  update(formValue: CaServerStandardSaveDTO): Observable<CaServerStandard> {
    return this.serverService.updateServerStandard(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'create_server_standard' : 'update_server_standard';
  }
}
