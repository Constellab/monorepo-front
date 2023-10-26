import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {Validators} from '@angular/forms';
import {CaCloudProviderService} from '../../../ca-core/service-api/ca-cloud-provider.service';
import {CaCloudProviderRegion} from '../../../ca-core/model/entities/ca-cloud-provider.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export type CaCloudProviderRegionFormDialogInput = FlFormDialogInput<CaCloudProviderRegion>;

/**
 * This component is used to create or update a cloud provider region.
 * This is in the AdminModule because it depends on SpaceCoreModule,
 * and if we put it in the CloudProviderModule, we will have a circular dependency.
 */
@Component({
  selector: 'ca-admin-bucket-region-form-dialog',
  templateUrl: './ca-admin-cloud-provider-region-form-dialog.component.html',
  styleUrls: ['./ca-admin-cloud-provider-region-form-dialog.component.scss']
})
export class CaAdminCloudProviderRegionFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaCloudProviderRegion>, CaCloudProviderRegion>
  implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) dialogInput: CaCloudProviderRegionFormDialogInput,
              private cloudProviderService: CaCloudProviderService,
              protected snackBarService: FlSnackBarService,
              protected dialogRef: MatDialogRef<CaAdminCloudProviderRegionFormDialogComponent>) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<Partial<CaCloudProviderRegion>> {
    return new FormBuilder().group({
      id: [null],
      technicalName: [null, Validators.required],
      cloudProvider: [null],
      city: [null, Validators.required],
      s3Endpoint: [null],
      space: [null],
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
