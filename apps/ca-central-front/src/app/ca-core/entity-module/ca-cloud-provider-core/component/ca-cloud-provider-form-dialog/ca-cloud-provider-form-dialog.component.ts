import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { CaCloudProvider } from '../../../../model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export type CaCloudProviderFormDialogInput = FlFormDialogInput<CaCloudProvider>;

/**
 * Dialog to create or update a cloud provider
 */
@Component({
  selector: 'ca-cloud-provider-form-dialog',
  templateUrl: './ca-cloud-provider-form-dialog.component.html',
  styleUrls: ['./ca-cloud-provider-form-dialog.component.scss'],
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
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaCloudProviderFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaCloudProvider>, CaCloudProvider>
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
      name: [null, Validators.required],
      description: [null],
      logo: [null],
    });
  }

  create(formValue: Partial<CaCloudProvider>): Observable<CaCloudProvider> {
    return this.cloudProviderService.create(formValue);
  }

  update(formValue: Partial<CaCloudProvider>): Observable<CaCloudProvider> {
    return this.cloudProviderService.update(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'create_cloud_provider' : 'update_cloud_provider';
  }

  getCreateSuccessMessage(): string {
    return 'cloud_provider_created';
  }

  getUpdateSuccessMessage(): string {
    return 'cloud_provider_updated';
  }
}
