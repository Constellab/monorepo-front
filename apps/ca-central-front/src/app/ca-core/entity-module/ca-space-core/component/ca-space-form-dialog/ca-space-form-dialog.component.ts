import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {CaSaveSpaceDTO, CaSpaceSettingsDto} from '../../../../model/entities/space/ca-space.class';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaSpaceService} from '../../../../service-api/ca-space.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export type CaSpaceFormDialogInput = FlFormDialogInput<CaSaveSpaceDTO>;

@Component({
  selector: 'ca-space-form-dialog',
  templateUrl: './ca-space-form-dialog.component.html',
  styleUrls: ['./ca-space-form-dialog.component.scss']
})
export class CaSpaceFormDialogComponent extends FlFormDialogAbstractDirective<CaSaveSpaceDTO, CaSpaceSettingsDto>
  implements OnInit {

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<CaSpaceFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: CaSpaceFormDialogInput,
              private spaceService: CaSpaceService) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_space' : 'update_space';
  }


  buildForm(): FormGroup<CaSaveSpaceDTO> {
    return new FormBuilder().group({
      id: [null],
      name: [null, [Validators.required]],
      defaultStorageRegion: [null, [Validators.required]],
      defaultBackupStorageRegion: [null, [Validators.required]],
      nbLicenses: [0, [Validators.required]],
    }, {validator: this.differentBackupRegionValidator()});
  }

  create(formValue: CaSaveSpaceDTO): Observable<CaSpaceSettingsDto> {
    return this.spaceService.create(formValue);
  }

  update(formValue: CaSaveSpaceDTO): Observable<CaSpaceSettingsDto> {
    return this.spaceService.update(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'space_created';
  }

  getUpdateSuccessMessage(): string {
    return 'space_updated';
  }

  private differentBackupRegionValidator(): ValidatorFn {
    return (control: FormGroup<CaSaveSpaceDTO>): { [key: string]: any } => {
      if (control.value.defaultStorageRegion == null || control.value.defaultBackupStorageRegion == null) return null;

      if (control.value.defaultStorageRegion.id === control.value.defaultBackupStorageRegion.id) {
        return {sameBackupRegion: true};
      }
      return null;
    };
  }


}
