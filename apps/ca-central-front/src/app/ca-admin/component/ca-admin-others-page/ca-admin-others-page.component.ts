import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

/**
 * Page to manager cloud providers, object storage, servers
 */
@Component({
  selector: 'ca-admin-others-page',
  templateUrl: './ca-admin-others-page.component.html',
  styleUrls: ['./ca-admin-others-page.component.scss'],
  standalone: false,
})
export class CaAdminOthersPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('admin_other_page')}`);
  }
}
