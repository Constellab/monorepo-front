import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaSelectCloudProviderOptionsComponent,
} from '../../../ca-cloud-provider-core/component/ca-select-cloud-provider-options/ca-select-cloud-provider-options.component';
import {
  CaSelectDiskTypeOptionsComponent,
} from '../ca-select-disk-type-options/ca-select-disk-type-options.component';
import {
  CaSelectServerStandardOptionsComponent,
} from '../ca-select-server-standard-options/ca-select-server-standard-options.component';

/**
 * Dialog to create or update a server info
 */
@Component({
  selector: 'ca-server-cloud-form-dialog',
  templateUrl: './ca-server-cloud-form-dialog.component.html',
  styleUrls: ['./ca-server-cloud-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    CaSelectCloudProviderOptionsComponent,
    MatError,
    MatInput,
    FlCoreDirectiveModule,
    CaSelectServerStandardOptionsComponent,
    CaSelectDiskTypeOptionsComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaServerCloudFormDialogComponent
  extends FlFormDialogAbstractDirective<CaServerCloud>
  implements OnInit
{
  private serverService = inject(CaServerService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      cloudProvider: [null, Validators.required],
      technicalName: [null, Validators.required],
      serverStandard: [null, Validators.required],
      ram: [null, [Validators.required, Validators.min(0)]],
      diskSpace: [null, [Validators.required, Validators.min(0)]],
      diskType: [null, Validators.required],
      cpuCount: [null, [Validators.required, Validators.min(0)]],
      cpuType: [null, [Validators.required]],
      gpuCount: [null, [Validators.min(0)]],
      gpuType: [null],
    });
  }

  create(formValue: CaServerCloud): Observable<CaServerCloud> {
    return this.serverService.createServerCloud(formValue);
  }

  update(formValue: CaServerCloud): Observable<CaServerCloud> {
    return this.serverService.updateServerCloud(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'create_server_cloud' : 'update_server_cloud';
  }

  getCreateSuccessMessage(): string {
    return 'server_cloud_created';
  }

  getUpdateSuccessMessage(): string {
    return 'server_cloud_updated';
  }
}
