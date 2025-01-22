import { Component, inject } from '@angular/core';
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
import { FlCardModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CaCloudProviderTableComponent } from '../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-table/ca-cloud-provider-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-admin-cloud-providers-list',
  templateUrl: './ca-admin-cloud-providers-list.component.html',
  styleUrls: ['./ca-admin-cloud-providers-list.component.scss'],
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
