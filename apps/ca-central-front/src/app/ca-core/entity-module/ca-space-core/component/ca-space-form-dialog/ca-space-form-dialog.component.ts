import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CaCreateSpaceDTO, CaSpaceSettingsDto } from '../../../../model/entities/space/ca-space.dto';
import { CaSpaceStorageFormComponent } from '../ca-space-storage-form/ca-space-storage-form.component';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export type CaSpaceFormDialogInput = FlFormDialogInput<CaCreateSpaceDTO>;

@Component({
  selector: 'ca-space-form-dialog',
  templateUrl: './ca-space-form-dialog.component.html',
  styleUrls: ['./ca-space-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
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
