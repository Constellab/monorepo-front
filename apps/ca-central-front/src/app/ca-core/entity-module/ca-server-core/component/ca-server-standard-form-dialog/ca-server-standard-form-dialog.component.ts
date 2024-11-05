import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  CaServerStandard,
  CaServerStandardSaveDTO,
} from '../../../../model/entities/server/ca-server-standard.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaServerService } from '../../../../service-api/ca-server.service';

export type CaServerStandardFormDialogInput = FlFormDialogInput<CaServerStandardSaveDTO>;

@Component({
  selector: 'ca-server-standard-form-dialog',
  templateUrl: './ca-server-standard-form-dialog.component.html',
  styleUrl: './ca-server-standard-form-dialog.component.scss',
})
export class CaServerStandardFormDialogComponent
  extends FlFormDialogAbstractDirective<CaServerStandardSaveDTO, CaServerStandard>
  implements OnInit
{
  dialogInput: CaServerStandardFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private serverService: CaServerService) {
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
