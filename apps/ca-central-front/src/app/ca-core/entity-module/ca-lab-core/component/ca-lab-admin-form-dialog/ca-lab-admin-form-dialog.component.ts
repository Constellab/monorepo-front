import { Component, inject, OnInit } from '@angular/core';
import { CaLabType, CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput, FlGlobalValidators, FlPlatformService } from '@monorepo/front-core-lib/fl-core';

import { CaLabValidator } from '../../../../model/entities/lab/ca-lab.validator';
import { CaLabAdminForm } from '../../../../model/entities/lab/ca-lab.form';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FlRadioButtonBigModule } from '@monorepo/front-core-lib/fl-radio-button-big';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { CaSelectSpaceComponent } from '../../../ca-space-core/component/ca-select-space/ca-select-space.component';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { CaSelectServerCloudComponent } from '../../../ca-server-core/component/ca-select-server-cloud/ca-select-server-cloud.component';
import { CaCloudProviderRegionInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaSelectCloudProviderRegionOptionsComponent } from '../../../ca-cloud-provider-core/component/ca-select-cloud-provider-region-options/ca-select-cloud-provider-region-options.component';
import { MatButton } from '@angular/material/button';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaLabAdminFormDialogInput extends FlFormDialogInput<CaLabAdminForm> {
  id?: string; // only on update mode
  object?: null;
}

/**
 * Form to create or update a lab (only accessible by admin)
 */
@Component({
  selector: 'ca-lab-admin-form-dialog',
  templateUrl: './ca-lab-admin-form-dialog.component.html',
  styleUrls: ['./ca-lab-admin-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlLoaderModule,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    FlRadioButtonBigModule,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    FlFormModule,
    CaSelectSpaceComponent,
    MatSelect,
    MatOption,
    CaSelectServerCloudComponent,
    MatSelectTrigger,
    CaCloudProviderRegionInlineComponent,
    CaSelectCloudProviderRegionOptionsComponent,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabAdminFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabAdminForm, CaLabWithSpace>
  implements OnInit
{
  private platformService = inject(FlPlatformService);
  private labService = inject(CaLabService);

  dialogInput: CaLabAdminFormDialogInput = inject(MAT_DIALOG_DATA);

  maxNameLength = CaLabWithSpace.MAX_NAME_LENGTH;

  supportedDomainsText = CaLabValidator.SUPPORTED_DOMAINS.join(', ');

  updateIsInitiated = false;

  constructor() {
    super();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_lab' : 'update_lab';
  }

  ngOnInit(): void {
    this.init();

    // for update this is call on patch method
    if (this.dialogInput.mode === 'create') {
      this.onTypeChange(this.formGp.getRawValue().type);
    }
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      name: [null, [Validators.required]],
      type: [{ value: 'CLOUD', disabled: this.isUpdateMode() }, [Validators.required]],
      virtualHost: [null, [Validators.required, CaLabValidator.virtualHostDomainValidator(true)]],
      serverCloud: [null, [Validators.required]],
      billingMode: [null, [Validators.required]],
      volumeSize: [
        {
          value: null,
          disabled: this.isUpdateMode(),
        },
        [Validators.required, FlGlobalValidators.isInteger, Validators.min(50)],
      ],
      volumeType: [{ value: 'HIGH_SPEED', disabled: this.isUpdateMode() }, [Validators.required]],
      glabProdApiKey: [null],
      glabDevApiKey: [null],
      labManagerApiKey: [null],
      codelabToken: [null],
      serverInstanceId: [null],
      serverVolumeId: [null],
      cloudName: [null],
      gwsCoreProdDbPassword: [null],
      gwsCoreDevDbPassword: [null],
      region: [null, Validators.required],
      space: [null, Validators.required],
      desktopPlatform: [this.platformService.isSafari() ? 'MAC' : 'WINDOWS', [Validators.required]],
      dailyBackupRegion: [{ value: null, disabled: this.isUpdateMode() }, [Validators.required]],
      weeklyBackupRegion: [{ value: null, disabled: this.isUpdateMode() }, [Validators.required]],
    });
  }

  /**
   * Override the patch so it can fetch the lab by id
   * @protected
   */
  protected patchUpdate(): void {
    this.labService.getByIdAdmin(this.dialogInput.id).subscribe({
      next: (lab) => {
        this.updateIsInitiated = true;
        this.formGp.patchValue(lab);
        this.onTypeChange(this.formGp.getRawValue().type);
      },
    });
  }

  onTypeChange(type: CaLabType): void {
    this.formGp.clearValidators();
    switch (type) {
      case 'CLOUD':
        this.formGp.get('virtualHost').enable();
        this.formGp.get('serverCloud').enable();
        this.formGp.get('billingMode').enable();
        this.formGp.get('labManagerApiKey').enable();
        this.formGp.get('codelabToken').enable();
        this.formGp.get('serverInstanceId').enable();
        this.formGp.get('serverVolumeId').enable();
        this.formGp.get('region').enable();

        this.formGp.get('desktopPlatform').disable();
        this.formGp
          .get('virtualHost')
          .setValidators([Validators.required, CaLabValidator.virtualHostDomainValidator(true)]);
        if (this.isCreateMode()) {
          this.formGp.get('volumeSize').enable();
          this.formGp.get('volumeType').enable();
          this.formGp.get('dailyBackupRegion').enable();
          this.formGp.get('weeklyBackupRegion').enable();
          this.formGp.addValidators([CaLabValidator.differentBackupRegionValidator()]);
        }
        break;
      case 'ON_PREMISE':
        this.formGp.get('virtualHost').enable();
        this.formGp.get('labManagerApiKey').enable();
        this.formGp.get('codelabToken').enable();

        this.formGp.get('serverCloud').disable();
        this.formGp.get('billingMode').disable();
        this.formGp.get('serverInstanceId').disable();
        this.formGp.get('serverVolumeId').disable();
        this.formGp.get('desktopPlatform').disable();
        this.formGp.get('region').disable();
        this.formGp.get('volumeSize').disable();
        this.formGp.get('volumeType').disable();
        this.formGp.get('dailyBackupRegion').disable();
        this.formGp.get('weeklyBackupRegion').disable();

        this.formGp
          .get('virtualHost')
          .setValidators([Validators.required, CaLabValidator.virtualHostDomainValidator(false)]);
        break;
      case 'DESKTOP':
        this.formGp.get('desktopPlatform').enable();

        this.formGp.get('virtualHost').disable();
        this.formGp.get('serverCloud').disable();
        this.formGp.get('billingMode').disable();
        this.formGp.get('labManagerApiKey').disable();
        this.formGp.get('codelabToken').disable();
        this.formGp.get('serverInstanceId').disable();
        this.formGp.get('serverVolumeId').disable();
        this.formGp.get('region').disable();
        this.formGp.get('volumeSize').disable();
        this.formGp.get('volumeType').disable();
        this.formGp.get('dailyBackupRegion').disable();
        this.formGp.get('weeklyBackupRegion').disable();

        break;
    }
    this.formGp.updateValueAndValidity();
  }

  isCloud(): boolean {
    return this.formGp.getRawValue().type === 'CLOUD';
  }

  isDesktop(): boolean {
    return this.formGp.getRawValue().type === 'DESKTOP';
  }

  isOnServer(): boolean {
    return this.formGp.getRawValue().type === 'CLOUD' || this.formGp.getRawValue().type === 'ON_PREMISE';
  }

  create(formValue: CaLabAdminForm): Observable<CaLabWithSpace> {
    return this.labService.createAdmin(formValue);
  }

  update(formValue: CaLabAdminForm): Observable<CaLabWithSpace> {
    return this.labService.updateAdmin(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'lab_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_updated';
  }
}
