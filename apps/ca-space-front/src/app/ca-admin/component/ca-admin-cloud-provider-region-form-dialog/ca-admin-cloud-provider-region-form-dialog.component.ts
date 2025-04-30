import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';
import { CaCloudProviderRegion } from '../../../ca-core/model/entities/ca-cloud-provider.class';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { CaSelectCloudProviderOptionsComponent } from '../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-select-cloud-provider-options/ca-select-cloud-provider-options.component';
import { CaSelectOptionsCityComponent } from '../../../ca-core/entity-module/ca-config-core/component/ca-select-city-options/ca-select-options-city.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
    CaSelectCloudProviderOptionsComponent,
    CaSelectOptionsCityComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaAdminCloudProviderRegionFormDialogComponent
  extends FlFormDialogAbstractDirective<CaCloudProviderRegion, CaCloudProviderRegion>
  implements OnInit
{
  private cloudProviderService = inject(CaCloudProviderService);

  constructor() {
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
