import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-users-page',
  templateUrl: './ca-admin-users-page.component.html',
  styleUrls: ['./ca-admin-users-page.component.scss'],
  standalone: false,
})
export class CaAdminUsersPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('users')}`);
  }
}
