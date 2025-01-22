import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { MaMailModule } from '../../../../../../../libs/mail/src/lib/ma-mail.module';

@Component({
  selector: 'ca-admin-mails-page',
  templateUrl: './ca-admin-mails-page.component.html',
  styleUrl: './ca-admin-mails-page.component.scss',
  imports: [MaMailModule],
})
export class CaAdminMailsPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('maMail.mails')}`);
  }
}
