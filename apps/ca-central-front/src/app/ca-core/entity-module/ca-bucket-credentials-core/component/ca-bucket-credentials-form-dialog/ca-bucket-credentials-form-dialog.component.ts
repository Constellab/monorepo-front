import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import {
  CaBucketCredentials,
  CaBucketCredentialsFull,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatSelect } from '@angular/material/select';
import { CaSelectCloudProviderOptionsComponent } from '../../../ca-cloud-provider-core/component/ca-select-cloud-provider-options/ca-select-cloud-provider-options.component';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { CaSelectSpaceComponent } from '../../../ca-space-core/component/ca-select-space/ca-select-space.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export type CaBucketCredentialsFormDialogInput = FlFormDialogInput<CaBucketCredentialsFull>;

@Component({
  selector: 'ca-bucket-credentials-form-dialog',
  templateUrl: './ca-bucket-credentials-form-dialog.component.html',
  styleUrls: ['./ca-bucket-credentials-form-dialog.component.scss'],
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
