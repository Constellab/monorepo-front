import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaCreateSpaceDTO, CaSpaceSettingsDto } from '../../../../model/entities/space/ca-space.dto';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { CaSpaceStorageFormComponent } from '../ca-space-storage-form/ca-space-storage-form.component';

export type CaSpaceFormDialogInput = FlFormDialogInput<CaCreateSpaceDTO>;

@Component({
  selector: 'ca-space-form-dialog',
  templateUrl: './ca-space-form-dialog.component.html',
  styleUrls: ['./ca-space-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    CaSpaceStorageFormComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaSpaceFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCreateSpaceDTO, CaSpaceSettingsDto>
  implements OnInit
{
  private spaceService = inject(CaSpaceService);

  dialogInput: CaSpaceFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, [Validators.required]],
      defaultStorageLocations: CaSpaceStorageFormComponent.buildForm(),
    });
  }

  create(formValue: CaCreateSpaceDTO): Observable<CaSpaceSettingsDto> {
    return this.spaceService.createEntrepriseSpace(formValue);
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
