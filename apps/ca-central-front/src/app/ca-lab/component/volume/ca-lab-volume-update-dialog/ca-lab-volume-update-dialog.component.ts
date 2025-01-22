import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  CaLabUpdateVolumeDTO,
  CaLabVolume,
  CaLabVolumeType,
} from '../../../../ca-core/model/entities/lab/ca-lab-volume.class';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaLabVolumeUpdateDialogInput extends FlFormDialogInput<CaLabUpdateVolumeDTO> {
  labId: string;
}

@Component({
  selector: 'ca-lab-volume-update-dialog',
  templateUrl: './ca-lab-volume-update-dialog.component.html',
  styleUrl: './ca-lab-volume-update-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabVolumeUpdateDialogComponent
  extends FlFormDialogAbstractDirective<CaLabUpdateVolumeDTO, CaLabVolume>
  implements OnInit
{
  dialogInput: CaLabVolumeUpdateDialogInput = inject(MAT_DIALOG_DATA);

  labService = inject(CaLabService);

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      size: [null, [Validators.required, Validators.min(50)]],
      type: ['HIGH_SPEED' as CaLabVolumeType, Validators.required],
      startDate: [null, Validators.required],
    });
  }

  create(formValue: CaLabUpdateVolumeDTO): Observable<CaLabVolume> {
    return this.labService.updateLabVolume(this.dialogInput.labId, formValue);
  }

  update(): Observable<CaLabVolume> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'volume_updated';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
