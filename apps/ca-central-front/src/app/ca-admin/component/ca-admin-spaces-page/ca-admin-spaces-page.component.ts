import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

/**
 * Search page for all the spaces
 */
@Component({
    selector: 'ca-admin-spaces-page',
    templateUrl: './ca-admin-spaces-page.component.html',
    styleUrls: ['./ca-admin-spaces-page.component.scss'],
    standalone: false
})
export class CaAdminSpacesPageComponent {
  constructor(titleService: Title, translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('space_list')}`);
  }
}
