import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaSpaceStorage } from '../../../../ca-core/model/entities/space/ca-space.dto';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface CaStorageLimit {
  limit: number;
}

export type CaStorageLimitUpdateDialogInput = FlFormDialogInput<CaStorageLimit>;

/**
 * Dialog for admin to update the storage limit of a space
 */
@Component({
  selector: 'ca-current-space-update-storage-dialog',
  templateUrl: './ca-current-space-update-storage-dialog.component.html',
  styleUrl: './ca-current-space-update-storage-dialog.component.scss',
  standalone: false,
})
export class CaCurrentSpaceUpdateStorageDialogComponent
  extends FlFormDialogAbstractDirective<CaStorageLimit, CaSpaceStorage>
  implements OnInit
{
  private spaceService = inject(CaSpaceService);

  dialogInput: CaStorageLimitUpdateDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      limit: [null, [Validators.required, Validators.min(0)]],
    });
  }

  create(): Observable<CaSpaceStorage> {
    throw new Error('Method not implemented.');
  }

  update(formValue: CaStorageLimit): Observable<CaSpaceStorage> {
    return this.spaceService.updateCurrentSpaceStorageLimit(formValue.limit);
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'space_storage_updated';
  }
}
