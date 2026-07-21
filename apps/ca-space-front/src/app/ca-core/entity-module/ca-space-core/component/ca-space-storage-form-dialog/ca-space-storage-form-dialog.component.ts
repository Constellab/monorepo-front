import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  CaSpaceStorage,
  CaSpaceUpdateStorageLocationDTO,
} from '../../../../model/entities/space/ca-space.dto';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { CaSpaceStorageFormComponent } from '../ca-space-storage-form/ca-space-storage-form.component';

export type CaSpaceStorageFormDialogInput = FlFormDialogInput<CaSpaceUpdateStorageLocationDTO>;

@Component({
  selector: 'ca-space-storage-form-dialog',
  templateUrl: './ca-space-storage-form-dialog.component.html',
  styleUrl: './ca-space-storage-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    CaSpaceStorageFormComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
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
