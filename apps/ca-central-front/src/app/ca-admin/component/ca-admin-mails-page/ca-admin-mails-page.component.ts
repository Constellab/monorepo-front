import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
    selector: 'ca-admin-mails-page',
    templateUrl: './ca-admin-mails-page.component.html',
    styleUrl: './ca-admin-mails-page.component.scss',
    standalone: false
})
export class CaAdminMailsPageComponent {
  constructor(titleService: Title, translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('maMail.mails')}`);
  }
}
