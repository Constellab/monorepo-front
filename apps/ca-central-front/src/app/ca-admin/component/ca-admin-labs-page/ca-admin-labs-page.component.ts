import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { CaLabSearchComponent } from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-search/ca-lab-search.component';

@Component({
  selector: 'ca-admin-labs-page',
  templateUrl: './ca-admin-labs-page.component.html',
  styleUrls: ['./ca-admin-labs-page.component.scss'],
  imports: [CaLabSearchComponent],
})
export class CaAdminLabsPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('labs')}`);
  }
}
