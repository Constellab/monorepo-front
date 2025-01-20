import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
    selector: 'ca-admin-labs-page',
    templateUrl: './ca-admin-labs-page.component.html',
    styleUrls: ['./ca-admin-labs-page.component.scss'],
    standalone: false
})
export class CaAdminLabsPageComponent {
  constructor(titleService: Title, translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('labs')}`);
  }
}
