import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaCloudProviderRegionInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import {
  CaSelectCloudProviderRegionOptionsComponent,
  CaSelectCloudProviderRegionOptionsMode,
} from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-select-cloud-provider-region-options/ca-select-cloud-provider-region-options.component';
import { CaSelectLabComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-select-lab/ca-select-lab.component';
import { CaSelectBucketCredentialsOptionsComponent } from '../../../../ca-core/entity-module/ca-object-storage-core/component/ca-select-bucket-credentials-options/ca-select-bucket-credentials-options.component';
import {
  CaBucketContentType,
  CaBucketFull,
  CaBucketType,
} from '../../../../ca-core/model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../ca-core/service-api/ca-object-storage.service';

export type CaBucketFormDialogInput = FlFormDialogInput<CaBucketFull>;

@Component({
  selector: 'ca-bucket-form-dialog',
  templateUrl: './ca-bucket-form-dialog.component.html',
  styleUrls: ['./ca-bucket-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatInput,
    FlCoreDirectiveModule,
    MatSelectTrigger,
    CaCloudProviderRegionInlineComponent,
    CaSelectCloudProviderRegionOptionsComponent,
    FlFormModule,
    CaSelectLabComponent,
    CaSelectBucketCredentialsOptionsComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaBucketFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaBucketFull>, CaBucketFull>
  implements OnInit
{
  private objectStorageService = inject(CaObjectStorageService);

  contentTypes = CaBucketContentType;
  bucketTypes = CaBucketType;

  regionOption: CaSelectCloudProviderRegionOptionsMode = 'S3';

  constructor() {
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

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      bucketType: [CaBucketType.NORMAL, Validators.required],
      name: [null, Validators.required],
      contentType: [null, Validators.required],
      region: [null, Validators.required],
      lab: [null, Validators.required],
      credentials: [null, Validators.required],
    });
  }

  onBucketTypeChange(bucketType: CaBucketType): void {
    // for the lab bucket the name is forced
    if (bucketType === CaBucketType.LAB) {
      this.formGp.get('name').disable();
      this.formGp.get('region').disable();
      this.formGp.get('lab').enable();
      this.formGp.get('contentType').setValue(CaBucketContentType.FOLDER);
      this.formGp.get('contentType').disable();
    } else {
      this.formGp.get('name').enable();
      this.formGp.get('region').enable();
      this.formGp.get('lab').disable();
      this.formGp.get('contentType').enable();

      if (bucketType === CaBucketType.NORMAL) {
        this.regionOption = 'S3';
      } else if (bucketType === CaBucketType.AZURE) {
        this.regionOption = 'AZURE';
      } else if (bucketType === CaBucketType.GCP) {
        this.regionOption = 'GCP';
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
