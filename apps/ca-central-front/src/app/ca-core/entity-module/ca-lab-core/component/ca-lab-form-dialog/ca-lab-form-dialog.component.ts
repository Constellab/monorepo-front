import { Component, OnInit } from '@angular/core';
import {
  CaLab,
  CaLabDesktopPlatform,
  CaLabType,
  CaLabWithSpace,
} from '../../../../model/entities/lab/ca-lab.class';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlPlatformService,
} from '@monorepo/front-core-lib';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

export type CaLabFormDialogInput = FlFormDialogInput<CaLabForm>;

interface CaLabForm {
  id: string;
  name: string;
  type: CaLabType;
  desktopPlatform?: CaLabDesktopPlatform;

  cloudProvider?: string;
  cpuCount?: string;
  storageSize?: string;
  labNeed?: string;
  additionalInfo?: string;
}

/**
 * Form to create or update a lab accessible by user
 */
@Component({
  selector: 'ca-lab-form-dialog',
  templateUrl: './ca-lab-form-dialog.component.html',
  styleUrls: ['./ca-lab-form-dialog.component.scss'],
})
export class CaLabFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabForm, any>
  implements OnInit
{
  maxNameLength = CaLab.MAX_NAME_LENGTH;

  constructor(
    private labService: CaLabService,
    private platformService: FlPlatformService
  ) {
    super();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_lab' : 'update_lab';
  }

  ngOnInit(): void {
    this.init();

    this.onTypeChange(this.formGp.value.type);
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      name: [null, [Validators.required]],
      type: [{ value: 'CLOUD', disabled: this.isUpdateMode() }, [Validators.required]],
      cloudProvider: [null],
      cpuCount: [null],
      storageSize: [null],
      labNeed: [null],
      additionalInfo: [null],
      desktopPlatform: [this.platformService.isSafari() ? 'MAC' : 'WINDOWS', [Validators.required]],
    });
  }

  onTypeChange(type: CaLabType): void {
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

  create(formValue: CaLabForm): Observable<any> {
    if (formValue.type === 'DESKTOP') {
      return this.createDesktopLab(formValue);
    } else {
      return this.requestCloudLab(formValue);
    }
  }

  private createDesktopLab(formValue: CaLabForm): Observable<CaLab> {
    return this.labService.createDesktopLab({
      id: formValue.id,
      name: formValue.name,
      desktopPlatform: formValue.desktopPlatform,
    });
  }

  private requestCloudLab(formValue: CaLabForm): Observable<CaLab> {
    return this.labService.requestNewLab({
      cloudProvider: formValue.cloudProvider,
      cpuCount: formValue.cpuCount,
      storageSize: formValue.storageSize,
      labNeed: formValue.labNeed,
      additionalInfo: formValue.additionalInfo,
    });
  }

  update(formValue: CaLabForm): Observable<CaLabWithSpace> {
    return this.labService.updateAdmin(formValue);
  }

  getCreateSuccessMessage(): string {
    return this.formGp.value.type === 'CLOUD' ? 'lab_request_sent' : 'lab_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_updated';
  }
}
