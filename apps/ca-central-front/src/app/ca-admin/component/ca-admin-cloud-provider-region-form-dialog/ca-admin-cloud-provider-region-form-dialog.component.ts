import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';
import { CaCloudProviderRegion } from '../../../ca-core/model/entities/ca-cloud-provider.class';

export type CaCloudProviderRegionFormDialogInput = FlFormDialogInput<CaCloudProviderRegion>;

/**
 * This component is used to create or update a cloud provider region.
 * This is in the AdminModule because it depends on SpaceCoreModule,
 * and if we put it in the CloudProviderModule, we will have a circular dependency.
 */
@Component({
  selector: 'ca-admin-bucket-region-form-dialog',
  templateUrl: './ca-admin-cloud-provider-region-form-dialog.component.html',
  styleUrls: ['./ca-admin-cloud-provider-region-form-dialog.component.scss'],
})
export class CaAdminCloudProviderRegionFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCloudProviderRegion, CaCloudProviderRegion>
  implements OnInit
{
  constructor(private cloudProviderService: CaCloudProviderService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      technicalName: [null, Validators.required],
      type: [null, Validators.required],
      name: [null, Validators.required],
      cloudProvider: [null],
      city: [null, Validators.required],
      s3Endpoint: [null],
    });
  }

  create(formValue: Partial<CaCloudProviderRegion>): Observable<CaCloudProviderRegion> {
    return this.cloudProviderService.createRegion(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'cloud_provider_region_created';
  }

  getUpdateSuccessMessage(): string {
    return 'cloud_provider_region_updated';
  }

  update(formValue: Partial<CaCloudProviderRegion>): Observable<CaCloudProviderRegion> {
    return this.cloudProviderService.updateRegion(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'create_cloud_provider_region' : 'update_cloud_provider_region';
  }
}
