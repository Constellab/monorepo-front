import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-users-page',
  templateUrl: './ca-admin-users-page.component.html',
  styleUrls: ['./ca-admin-users-page.component.scss'],
})
export class CaAdminUsersPageComponent {
  constructor(titleService: Title, translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('users')}`);
  }
}
