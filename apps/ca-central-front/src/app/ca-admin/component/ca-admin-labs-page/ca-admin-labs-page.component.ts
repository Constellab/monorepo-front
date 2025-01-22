import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-labs-page',
  templateUrl: './ca-admin-labs-page.component.html',
  styleUrls: ['./ca-admin-labs-page.component.scss'],
  standalone: false,
})
export class CaAdminLabsPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('labs')}`);
  }
}
