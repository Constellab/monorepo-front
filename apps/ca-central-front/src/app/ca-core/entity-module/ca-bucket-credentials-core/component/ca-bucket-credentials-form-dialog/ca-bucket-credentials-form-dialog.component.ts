import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import {
  CaBucketCredentials,
  CaBucketCredentialsFull,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatSelect } from '@angular/material/select';
import { CaSelectCloudProviderOptionsComponent } from '../../../ca-cloud-provider-core/component/ca-select-cloud-provider-options/ca-select-cloud-provider-options.component';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { CaSelectSpaceComponent } from '../../../ca-space-core/component/ca-select-space/ca-select-space.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export type CaBucketCredentialsFormDialogInput = FlFormDialogInput<CaBucketCredentialsFull>;

@Component({
  selector: 'ca-bucket-credentials-form-dialog',
  templateUrl: './ca-bucket-credentials-form-dialog.component.html',
  styleUrls: ['./ca-bucket-credentials-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatSelect,
    CaSelectCloudProviderOptionsComponent,
    FlFormModule,
    CaSelectSpaceComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaBucketCredentialsFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaBucketCredentialsFull>, CaBucketCredentials>
  implements OnInit
{
  private objectStorageService = inject(CaObjectStorageService);

  constructor() {
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
