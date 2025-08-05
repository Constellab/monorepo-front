import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaUserSearchComponent } from '../../../ca-core/entity-module/ca-user-core/component/ca-user-search/ca-user-search.component';

@Component({
  selector: 'ca-admin-users-page',
  templateUrl: './ca-admin-users-page.component.html',
  styleUrls: ['./ca-admin-users-page.component.scss'],
  imports: [CaUserSearchComponent],
})
export class CaAdminUsersPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('users')}`);
  }
}
