import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaSpaceSearchComponent } from '../../../ca-core/entity-module/ca-space-core/component/ca-space-search/ca-space-search.component';

/**
 * Search page for all the spaces
 */
@Component({
  selector: 'ca-admin-spaces-page',
  templateUrl: './ca-admin-spaces-page.component.html',
  styleUrls: ['./ca-admin-spaces-page.component.scss'],
  imports: [CaSpaceSearchComponent],
})
export class CaAdminSpacesPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('space_list')}`);
  }
}
