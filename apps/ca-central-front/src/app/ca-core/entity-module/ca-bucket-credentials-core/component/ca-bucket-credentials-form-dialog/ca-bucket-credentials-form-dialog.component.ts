import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  CaBucketCredentials,
  CaBucketCredentialsFull,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

export type CaBucketCredentialsFormDialogInput = FlFormDialogInput<CaBucketCredentialsFull>;

@Component({
  selector: 'ca-bucket-credentials-form-dialog',
  templateUrl: './ca-bucket-credentials-form-dialog.component.html',
  styleUrls: ['./ca-bucket-credentials-form-dialog.component.scss'],
})
export class CaBucketCredentialsFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaBucketCredentialsFull>, CaBucketCredentials>
  implements OnInit
{
  constructor(private objectStorageService: CaObjectStorageService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      name: [null, Validators.required],
      accessKeyId: [null, Validators.required],
      secretAccessKey: [null, Validators.required],
      cloudProvider: [null],
      space: [null],
      s3Username: [null],
      shortDescription: [null],
    });
  }

  create(formValue: Partial<CaBucketCredentialsFull>): Observable<CaBucketCredentials> {
    return this.objectStorageService.createCredentials(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'bucket_credentials_created';
  }

  getUpdateSuccessMessage(): string {
    return 'bucket_credentials_updated';
  }

  update(formValue: Partial<CaBucketCredentialsFull>): Observable<CaBucketCredentials> {
    return this.objectStorageService.updateCredentials(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'create_bucket_credentials' : 'update_bucket_credentials';
  }
}
