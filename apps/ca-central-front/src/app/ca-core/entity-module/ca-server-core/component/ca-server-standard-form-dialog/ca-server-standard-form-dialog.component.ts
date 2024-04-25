import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {CaServerStandard, CaServerStandardSaveDTO} from '../../../../model/entities/server/ca-server-standard.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaServerService} from '../../../../service-api/ca-server.service';

export type CaServerStandardFormDialogInput = FlFormDialogInput<CaServerStandardSaveDTO>;

@Component({
  selector: 'ca-server-standard-form-dialog',
  templateUrl: './ca-server-standard-form-dialog.component.html',
  styleUrl: './ca-server-standard-form-dialog.component.scss'
})
export class CaServerStandardFormDialogComponent extends FlFormDialogAbstractDirective<CaServerStandardSaveDTO, CaServerStandard>
  implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) dialogInput: CaServerStandardFormDialogInput,
              private serverService: CaServerService,
              protected snackBarService: FlSnackBarService,
              protected dialogRef: MatDialogRef<CaServerStandardFormDialogComponent>) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaServerStandardSaveDTO> {
    const formGp = new FormBuilder().group({
      id: [null],
      name: [null, Validators.required],
      description: [null, Validators.required],
      technicalDescription: [null, Validators.required],
      price: [null]
    }) as FormGroup<CaServerStandardSaveDTO>;

    // price is only available in create mode
    if(this.isCreateMode()){
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
