import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {CaBucketContentType, CaBucketFull, CaBucketType} from '../../../../model/entities/ca-object-storage.class';
import {CaObjectStorageService} from '../../../../service-api/ca-object-storage.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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

  constructor(@Inject(MAT_DIALOG_DATA) dialogInput: CaBucketFormDialogInput,
              private objectStorageService: CaObjectStorageService,
              protected snackBarService: FlSnackBarService,
              protected dialogRef: MatDialogRef<CaBucketFormDialogComponent>) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<Partial<CaBucketFull>> {
    return new FormBuilder().group({
      id: [null],
      bucketType: [null, Validators.required],
      name: [null, Validators.required],
      contentType: [null, Validators.required],
      region: [null, Validators.required],
      credentials: [null, Validators.required],
    });
  }

  onBucketTypeChange(bucketType: CaBucketType): void {
    // for the lab bucket the name is forced
    if (bucketType === CaBucketType.LAB) {
      this.formGp.get('name').disable();
    }else {
      this.formGp.get('name').enable();
    }
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
