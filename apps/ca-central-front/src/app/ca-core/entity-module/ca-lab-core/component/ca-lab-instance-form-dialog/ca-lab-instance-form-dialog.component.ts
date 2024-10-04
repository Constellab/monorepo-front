import { Component, OnInit } from '@angular/core';
import {
  CaLabDesktopPlatform,
  CaLabInstance,
  CaLabInstanceType,
  CaLabInstanceWithSpace
} from '../../../../model/entities/lab/ca-lab-instance.class';
import { FlFormDialogAbstractDirective, FlFormDialogInput, FlPlatformService } from '@monorepo/front-core-lib';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

export type CaLabInstanceFormDialogInput = FlFormDialogInput<CaLabInstanceForm>;

interface CaLabInstanceForm {
  id: string;
  name: string;
  type: CaLabInstanceType;
  desktopPlatform?: CaLabDesktopPlatform;

  cloudProvider?: string;
  cpuCount?: string;
  storageSize?: string;
  labNeed?: string;
  additionalInfo?: string;
}

/**
 * Form to create or update a lab instance accessible by user
 */
@Component({
  selector: 'ca-lab-instance-form-dialog',
  templateUrl: './ca-lab-instance-form-dialog.component.html',
  styleUrls: ['./ca-lab-instance-form-dialog.component.scss']
})
export class CaLabInstanceFormDialogComponent extends FlFormDialogAbstractDirective<CaLabInstanceForm, any>
  implements OnInit {

  maxNameLength = CaLabInstance.MAX_NAME_LENGTH;

  constructor(private labInstanceService: CaLabInstanceService,
              private platformService: FlPlatformService) {
    super();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_lab_instance' : 'update_lab';
  }

  ngOnInit(): void {
    this.init();

    this.onTypeChange(this.formGp.value.type);
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      name: [null, [Validators.required]],
      type: [{value: 'CLOUD', disabled: this.isUpdateMode()}, [Validators.required]],
      cloudProvider: [null],
      cpuCount: [null],
      storageSize: [null],
      labNeed: [null],
      additionalInfo: [null],
      desktopPlatform: [this.platformService.isSafari() ? 'MAC' : 'WINDOWS', [Validators.required]],
    });
  }

  onTypeChange(type: CaLabInstanceType): void {
    if (type === 'CLOUD') {
      this.formGp.get('name').disable();
      this.formGp.get('desktopPlatform').disable();
    } else {
      this.formGp.get('name').enable();
      this.formGp.get('desktopPlatform').enable();
    }
    this.formGp.updateValueAndValidity();
  }

  isCloud(): boolean {
    return this.formGp.value.type === 'CLOUD';
  }

  create(formValue: CaLabInstanceForm): Observable<any> {
    if (formValue.type === 'DESKTOP') {
      return this.createDesktopLab(formValue);
    } else {
      return this.requestCloudLab(formValue);
    }
  }

  private createDesktopLab(formValue: CaLabInstanceForm): Observable<CaLabInstance> {
    return this.labInstanceService.createDesktopLab({
      id: formValue.id,
      name: formValue.name,
      desktopPlatform: formValue.desktopPlatform,
    });
  }

  private requestCloudLab(formValue: CaLabInstanceForm): Observable<CaLabInstance> {
    return this.labInstanceService.requestNewLabInstance({
      cloudProvider: formValue.cloudProvider,
      cpuCount: formValue.cpuCount,
      storageSize: formValue.storageSize,
      labNeed: formValue.labNeed,
      additionalInfo: formValue.additionalInfo,
    });
  }

  update(formValue: CaLabInstanceForm): Observable<CaLabInstanceWithSpace> {
    return this.labInstanceService.updateAdmin(formValue);
  }

  getCreateSuccessMessage(): string {
    return this.formGp.value.type === 'CLOUD' ? 'lab_instance_request_sent' : 'lab_instance_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_instance_updated';
  }


}
