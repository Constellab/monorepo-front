import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaCloudProviderFormDialogComponent,
  CaCloudProviderFormDialogInput,
} from '../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-form-dialog/ca-cloud-provider-form-dialog.component';
import { CaCloudProviderTableComponent } from '../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-table/ca-cloud-provider-table.component';
import {
  CaCloudProvider,
  CaCloudProviderDatasource,
} from '../../../ca-core/model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../ca-core/service-api/ca-cloud-provider.service';

@Component({
  selector: 'ca-admin-cloud-providers-list',
  templateUrl: './ca-admin-cloud-providers-list.component.html',
  styleUrls: ['./ca-admin-cloud-providers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    CaCloudProviderTableComponent,
    TranslatePipe,
  ],
})
export class CaAdminCloudProvidersListComponent {
  private cloudProviderService = inject(CaCloudProviderService);
  private dialogService = inject(FlDialogService);

  cloudProviders: CaCloudProviderDatasource = this.cloudProviderService.findAllDatasource();

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
