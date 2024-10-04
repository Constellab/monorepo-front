import { Component, inject, OnInit } from '@angular/core';
import { CaLabInstanceType, CaLabInstanceWithSpace } from '../../../../model/entities/lab/ca-lab-instance.class';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlGlobalValidators,
  FlPlatformService
} from '@monorepo/front-core-lib';
import { CaLabInstanceValidator } from '../../../../model/entities/lab/ca-lab-instance.validator';
import { CaLabInstanceAdminForm } from '../../../../model/entities/lab/ca-lab-instance.form';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CaLabInstanceAdminFormDialogInput extends FlFormDialogInput<CaLabInstanceAdminForm> {
  id?: string; // only on update mode
  object?: null;
}

/**
 * Form to create or update a lab instance (only accessible by admin)
 */
@Component({
  selector: 'ca-lab-instance-admin-form-dialog',
  templateUrl: './ca-lab-instance-admin-form-dialog.component.html',
  styleUrls: ['./ca-lab-instance-admin-form-dialog.component.scss']
})
export class CaLabInstanceAdminFormDialogComponent extends FlFormDialogAbstractDirective<CaLabInstanceAdminForm, CaLabInstanceWithSpace>
  implements OnInit {

  dialogInput: CaLabInstanceAdminFormDialogInput = inject(MAT_DIALOG_DATA);

  maxNameLength = CaLabInstanceWithSpace.MAX_NAME_LENGTH;

  supportedDomainsText = CaLabInstanceValidator.SUPPORTED_DOMAINS.join(', ');

  updateIsInitiated = false;

  constructor(private platformService: FlPlatformService,
              private labInstanceService: CaLabInstanceService) {
    super();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_lab_instance' : 'update_lab';
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
      virtualHost: [null, [Validators.required, CaLabInstanceValidator.virtualHostDomainValidator(true)]],
      serverCloud: [null, [Validators.required]],
      billingMode: [null, [Validators.required]],
      volumeSize: [null, [Validators.required, FlGlobalValidators.isInteger, Validators.min(50)]],
      volumeType: ['HIGH_SPEED', [Validators.required]],
      glabApiKey: [null],
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
      weeklyBackupRegion: [{ value: null, disabled: this.isUpdateMode() }, [Validators.required]]
    });
  }

  /**
   * Override the patch so it can fetch the lab instance by id
   * @protected
   */
  protected patchUpdate(): void {
    this.labInstanceService.getByIdAdmin(this.dialogInput.id).subscribe({
      next: labInstance => {
        this.updateIsInitiated = true;
        this.formGp.patchValue(labInstance);
        this.onTypeChange(this.formGp.getRawValue().type);
      }
    });
  }


  submit(): void {
    for (const [key, control] of Object.entries(this.formGp.controls)) {
      if (control.invalid && !control.disabled) {
        console.log(key, control);
      }
    }
    super.submit();
  }

  onTypeChange(type: CaLabInstanceType): void {
    this.formGp.clearValidators();
    switch (type) {
      case 'CLOUD':
        this.formGp.get('virtualHost').enable();
        this.formGp.get('serverCloud').enable();
        this.formGp.get('billingMode').enable();
        this.formGp.get('volumeSize').enable();
        this.formGp.get('volumeType').enable();
        this.formGp.get('labManagerApiKey').enable();
        this.formGp.get('codelabToken').enable();
        this.formGp.get('serverInstanceId').enable();
        this.formGp.get('serverVolumeId').enable();
        this.formGp.get('region').enable();

        this.formGp.get('desktopPlatform').disable();
        this.formGp.get('virtualHost').setValidators([Validators.required, CaLabInstanceValidator.virtualHostDomainValidator(true)]);
        if (this.isCreateMode()) {
          this.formGp.get('dailyBackupRegion').enable();
          this.formGp.get('weeklyBackupRegion').enable();
          this.formGp.addValidators([CaLabInstanceValidator.differentBackupRegionValidator()]);
        }
        break;
      case 'ON_PREMISE':
        this.formGp.get('virtualHost').enable();
        this.formGp.get('labManagerApiKey').enable();
        this.formGp.get('codelabToken').enable();

        this.formGp.get('serverCloud').disable();
        this.formGp.get('volumeSize').disable();
        this.formGp.get('volumeType').disable();
        this.formGp.get('billingMode').disable();
        this.formGp.get('serverInstanceId').disable();
        this.formGp.get('serverVolumeId').disable();
        this.formGp.get('desktopPlatform').disable();
        this.formGp.get('region').disable();
        this.formGp.get('dailyBackupRegion').disable();
        this.formGp.get('weeklyBackupRegion').disable();


        this.formGp.get('virtualHost').setValidators([Validators.required, CaLabInstanceValidator.virtualHostDomainValidator(false)]);
        break;
      case 'DESKTOP':
        this.formGp.get('desktopPlatform').enable();

        this.formGp.get('virtualHost').disable();
        this.formGp.get('serverCloud').disable();
        this.formGp.get('billingMode').disable();
        this.formGp.get('volumeSize').disable();
        this.formGp.get('volumeType').disable();
        this.formGp.get('labManagerApiKey').disable();
        this.formGp.get('codelabToken').disable();
        this.formGp.get('serverInstanceId').disable();
        this.formGp.get('serverVolumeId').disable();
        this.formGp.get('region').disable();
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

  create(formValue: CaLabInstanceAdminForm): Observable<CaLabInstanceWithSpace> {
    return this.labInstanceService.createAdmin(formValue);
  }

  update(formValue: CaLabInstanceAdminForm): Observable<CaLabInstanceWithSpace> {
    return this.labInstanceService.updateAdmin(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'lab_instance_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_instance_updated';
  }

}
