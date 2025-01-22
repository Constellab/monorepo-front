import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  CaSpaceStorage,
  CaSpaceUpdateStorageLocationDTO,
} from '../../../../model/entities/space/ca-space.dto';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { Observable } from 'rxjs';
import { CaSpaceStorageFormComponent } from '../ca-space-storage-form/ca-space-storage-form.component';
import { UntypedFormGroup } from '@angular/forms';

export type CaSpaceStorageFormDialogInput = FlFormDialogInput<CaSpaceUpdateStorageLocationDTO>;

@Component({
  selector: 'ca-space-storage-form-dialog',
  templateUrl: './ca-space-storage-form-dialog.component.html',
  styleUrl: './ca-space-storage-form-dialog.component.scss',
  standalone: false,
})
export class CaSpaceStorageFormDialogComponent
  extends FlFormDialogAbstractDirective<CaSpaceUpdateStorageLocationDTO, CaSpaceStorage>
  implements OnInit
{
  private spaceService = inject(CaSpaceService);

  dialogInput: CaSpaceStorageFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
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
