import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaSpaceService} from '../../../../service-api/ca-space.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaSaveSpaceDTO, CaSpaceSettingsDto} from '../../../../model/entities/space/ca-space-form.class';
import {
  CaBucketLocationSelectMode
} from '../../../ca-object-storage-core/component/ca-bucket-location-select-options/ca-bucket-location-select-options.component';

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
      defaultProjectStorageLocation: [null, [Validators.required]],
      defaultProjectBackupStorageLocation: [null],
      nbLicenses: [0, [Validators.required]],
    }, {validator: this.differentProjectStorageValidator()});
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

  private differentProjectStorageValidator(): ValidatorFn {
    return (control: FormGroup<CaSaveSpaceDTO>): { [key: string]: any } => {
      if (control.value.defaultProjectStorageLocation == null || control.value.defaultProjectBackupStorageLocation == null) return null;

      if (control.value.defaultProjectStorageLocation.bucketId === control.value.defaultProjectBackupStorageLocation.bucketId) {
        return {sameBackupStorage: true};
      }
      return null;
    };
  }

  /**
   * In create mode, we can only select cloud bucket because there is no lab in the new space.
   */
  getBucketLocationSelectMode(): CaBucketLocationSelectMode {
    return this.isCreateMode() ? 'cloud' : 'all';
  }

}
