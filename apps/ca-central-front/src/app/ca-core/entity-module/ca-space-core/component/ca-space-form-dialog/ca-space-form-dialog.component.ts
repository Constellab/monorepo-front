import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CaSpaceService} from '../../../../service-api/ca-space.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaCreateSpaceDTO, CaSpaceSettingsDto} from '../../../../model/entities/space/ca-space.dto';
import {CaSpaceStorageFormComponent} from '../ca-space-storage-form/ca-space-storage-form.component';

export type CaSpaceFormDialogInput = FlFormDialogInput<CaCreateSpaceDTO>;

@Component({
  selector: 'ca-space-form-dialog',
  templateUrl: './ca-space-form-dialog.component.html',
  styleUrls: ['./ca-space-form-dialog.component.scss']
})
export class CaSpaceFormDialogComponent extends FlFormDialogAbstractDirective<CaCreateSpaceDTO, CaSpaceSettingsDto>
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

  buildForm(): FormGroup<CaCreateSpaceDTO> {
    return new FormBuilder().group({
      name: [null, [Validators.required]],
      defaultStorageLocations: CaSpaceStorageFormComponent.buildForm(),
    });
  }

  create(formValue: CaCreateSpaceDTO): Observable<CaSpaceSettingsDto> {
    return this.spaceService.create(formValue);
  }

  update(): Observable<CaSpaceSettingsDto> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'space_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
