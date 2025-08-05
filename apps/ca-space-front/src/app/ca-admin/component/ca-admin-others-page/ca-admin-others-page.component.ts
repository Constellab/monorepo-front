import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaBucketCredentialsListComponent } from '../../../ca-core/entity-module/ca-bucket-credentials-core/component/ca-bucket-credentials-list/ca-bucket-credentials-list.component';
import { CaAdminCloudProviderRegionsListComponent } from '../ca-admin-cloud-provider-regions-list/ca-admin-cloud-provider-regions-list.component';
import { CaAdminCloudProvidersListComponent } from '../ca-admin-cloud-providers-list/ca-admin-cloud-providers-list.component';

/**
 * Page to manager cloud providers, object storage, servers
 */
@Component({
  selector: 'ca-admin-others-page',
  templateUrl: './ca-admin-others-page.component.html',
  styleUrls: ['./ca-admin-others-page.component.scss'],
  imports: [
    CaAdminCloudProvidersListComponent,
    CaAdminCloudProviderRegionsListComponent,
    CaBucketCredentialsListComponent,
  ],
})
export class CaAdminOthersPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('admin_other_page')}`);
  }
}
