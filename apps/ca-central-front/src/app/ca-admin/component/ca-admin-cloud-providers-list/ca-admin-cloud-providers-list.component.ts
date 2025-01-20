import { Component } from '@angular/core';
import {
  CaCloudProvider,
  CaCloudProviderDatasource,
} from '../../../ca-core/model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaCloudProviderFormDialogComponent,
  CaCloudProviderFormDialogInput,
} from '../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-form-dialog/ca-cloud-provider-form-dialog.component';

@Component({
    selector: 'ca-admin-cloud-providers-list',
    templateUrl: './ca-admin-cloud-providers-list.component.html',
    styleUrls: ['./ca-admin-cloud-providers-list.component.scss'],
    standalone: false
})
export class CaAdminCloudProvidersListComponent {
  cloudProviders: CaCloudProviderDatasource = this.cloudProviderService.findAllDatasource();

  constructor(
    private cloudProviderService: CaCloudProviderService,
    private dialogService: FlDialogService
  ) {}

  openCreateDialog(): void {
    const input: CaCloudProviderFormDialogInput = { mode: 'create' };
    this.dialogService
      .openSmallDialog(CaCloudProviderFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((cloudProvider: CaCloudProvider) => this.onCreateClosed(cloudProvider));
  }

  private onCreateClosed(cloudProvider?: CaCloudProvider): void {
    if (cloudProvider) {
      this.cloudProviders.addItem(cloudProvider);
    }
  }
}
