import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import { CaLabFreeCreateDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import {
  CaSelectSpaceComponent,
} from '../../../ca-space-core/component/ca-select-space/ca-select-space.component';

/**
 * Admin form to create a free lab
 */
@Component({
  selector: 'ca-lab-free-admin-form-dialog',
  templateUrl: './ca-lab-free-admin-form-dialog.component.html',
  styleUrl: './ca-lab-free-admin-form-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    FlUserModule,
    MatError,
    CaSelectSpaceComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabFreeAdminFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabFreeCreateDto, CaLabWithSpace>
  implements OnInit
{
  private labService = inject(CaLabService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      user: [null, Validators.required],
      space: [null, Validators.required],
    });
  }

  create(formValue: CaLabFreeCreateDto): Observable<CaLabWithSpace> {
    return this.labService.createFreeLab(formValue);
  }

  update(): Observable<CaLabWithSpace> {
    throw Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'lab_free_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
