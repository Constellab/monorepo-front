import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { Observable } from 'rxjs';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';

/**
 * Dialog to create or update a server info
 */
@Component({
  selector: 'ca-server-cloud-form-dialog',
  templateUrl: './ca-server-cloud-form-dialog.component.html',
  styleUrls: ['./ca-server-cloud-form-dialog.component.scss'],
})
export class CaServerCloudFormDialogComponent
  extends FlFormDialogAbstractDirective<CaServerCloud>
  implements OnInit
{
  constructor(private serverService: CaServerService) {
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
