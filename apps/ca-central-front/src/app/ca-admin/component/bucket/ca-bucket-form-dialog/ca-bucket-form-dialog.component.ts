import {Component, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput} from '@monorepo/front-core-lib';
import {
  CaBucketContentType,
  CaBucketFull,
  CaBucketType
} from '../../../../ca-core/model/entities/ca-object-storage.class';
import {CaObjectStorageService} from '../../../../ca-core/service-api/ca-object-storage.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';

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
      credentials: [null, Validators.required],
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
      this.formGp.get('contentType').enable();
    }

    this.formGp.updateValueAndValidity();
  }

  showRegion(): boolean {
    return this.formGp.get('bucketType').value === CaBucketType.NORMAL;
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
