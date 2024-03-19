import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {CaSpaceStorage, CaSpaceUpdateStorageLocationDTO} from '../../../../model/entities/space/ca-space.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaSpaceService} from '../../../../service-api/ca-space.service';
import {FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {CaSpaceStorageFormComponent} from '../ca-space-storage-form/ca-space-storage-form.component';

export type CaSpaceStorageFormDialogInput = FlFormDialogInput<CaSpaceUpdateStorageLocationDTO>;


@Component({
  selector: 'ca-space-storage-form-dialog',
  templateUrl: './ca-space-storage-form-dialog.component.html',
  styleUrl: './ca-space-storage-form-dialog.component.scss'
})
export class CaSpaceStorageFormDialogComponent extends FlFormDialogAbstractDirective<CaSpaceUpdateStorageLocationDTO, CaSpaceStorage>
  implements OnInit {

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<CaSpaceStorageFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: CaSpaceStorageFormDialogInput,
              private spaceService: CaSpaceService) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaSpaceUpdateStorageLocationDTO> {
    return CaSpaceStorageFormComponent.buildForm();
  }

  create(): Observable<CaSpaceStorage> {
    throw new Error('Method not implemented.');
  }

  update(formValue: CaSpaceUpdateStorageLocationDTO): Observable<CaSpaceStorage> {
    return this.spaceService.updateCurrentSpaceStorageLocation(formValue);
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'space_default_storage_updated';
  }
}
