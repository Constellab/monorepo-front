import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  CaBucketContentType,
  CaBucketFull,
  CaBucketType
} from '../../../../ca-core/model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../ca-core/service-api/ca-object-storage.service';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  CaSelectCloudProviderRegionOptionsMode
} from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-select-cloud-provider-region-options/ca-select-cloud-provider-region-options.component';

export type CaBucketFormDialogInput = FlFormDialogInput<CaBucketFull>;

@Component({
  selector: 'ca-bucket-form-dialog',
  templateUrl: './ca-bucket-form-dialog.component.html',
  styleUrls: ['./ca-bucket-form-dialog.component.scss']
})
export class CaBucketFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaBucketFull>, CaBucketFull>
  implements OnInit {

  contentTypes = CaBucketContentType;
  bucketTypes = CaBucketType;

  regionOption: CaSelectCloudProviderRegionOptionsMode = 'S3';

  constructor(private objectStorageService: CaObjectStorageService) {
    super();
  }

  ngOnInit(): void {
    this.init();

    if (this.isUpdateMode() && this.dialogInput.object.bucketType) {
      this.onBucketTypeChange(this.dialogInput.object.bucketType);
    } else {
      this.onBucketTypeChange(CaBucketType.NORMAL);
    }
  }

  buildForm(): FormGroup<Partial<CaBucketFull>> {
    return new FormBuilder().group({
      id: [null],
      bucketType: [CaBucketType.NORMAL, Validators.required],
      name: [null, Validators.required],
      contentType: [null, Validators.required],
      region: [null, Validators.required],
      labInstance: [null, Validators.required],
      credentials: [null, Validators.required]
    });
  }

  onBucketTypeChange(bucketType: CaBucketType): void {
    // for the lab bucket the name is forced
    if (bucketType === CaBucketType.LAB) {
      this.formGp.get('name').disable();
      this.formGp.get('region').disable();
      this.formGp.get('labInstance').enable();
      this.formGp.get('contentType').setValue(CaBucketContentType.PROJECT);
      this.formGp.get('contentType').disable();
    } else {
      this.formGp.get('name').enable();
      this.formGp.get('region').enable();
      this.formGp.get('labInstance').disable();

      if (bucketType === CaBucketType.NORMAL) {
        this.formGp.get('contentType').enable();
        this.regionOption = 'S3';
      } else if (bucketType === CaBucketType.AZURE) {
        this.regionOption = 'AZURE';
        this.formGp.get('contentType').setValue(CaBucketContentType.LAB_BACKUP);
        this.formGp.get('contentType').disable();
      }
    }

    this.formGp.updateValueAndValidity();
  }

  showRegion(): boolean {
    return this.formGp.get('bucketType').value !== CaBucketType.LAB;
  }

  create(formValue: Partial<CaBucketFull>): Observable<CaBucketFull> {
    return this.objectStorageService.createBucket(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'bucket_created';
  }

  getUpdateSuccessMessage(): string {
    return 'bucket_updated';
  }

  update(formValue: Partial<CaBucketFull>): Observable<CaBucketFull> {
    return this.objectStorageService.updateBucket(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'create_bucket' : 'update_bucket';
  }


}
