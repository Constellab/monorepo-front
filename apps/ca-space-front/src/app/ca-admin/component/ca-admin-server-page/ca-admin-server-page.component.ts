import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaServerCloudSearchComponent } from '../../../ca-core/entity-module/ca-server-core/component/ca-server-cloud-search/ca-server-cloud-search.component';
import { CaAdminServerStandardListComponent } from '../ca-admin-server-standard-list/ca-admin-server-standard-list.component';
import { CaAdminStoragePriceComponent } from '../ca-admin-storage-price/ca-admin-storage-price.component';

@Component({
  selector: 'ca-admin-server-page',
  templateUrl: './ca-admin-server-page.component.html',
  styleUrls: ['./ca-admin-server-page.component.scss'],
  imports: [CaAdminStoragePriceComponent, CaAdminServerStandardListComponent, CaServerCloudSearchComponent],
})
export class CaAdminServerPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('servers')}`);
  }
}
