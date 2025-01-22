import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaLabFreeCreateDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatError } from '@angular/material/form-field';
import { CaSelectSpaceComponent } from '../../../ca-space-core/component/ca-select-space/ca-select-space.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Admin form to create a free lab
 */
@Component({
  selector: 'ca-lab-free-admin-form-dialog',
  templateUrl: './ca-lab-free-admin-form-dialog.component.html',
  styleUrl: './ca-lab-free-admin-form-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
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
