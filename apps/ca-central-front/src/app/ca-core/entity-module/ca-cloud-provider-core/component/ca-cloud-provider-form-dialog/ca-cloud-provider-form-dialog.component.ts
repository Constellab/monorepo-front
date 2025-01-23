import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { CaCloudProvider } from '../../../../model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
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
