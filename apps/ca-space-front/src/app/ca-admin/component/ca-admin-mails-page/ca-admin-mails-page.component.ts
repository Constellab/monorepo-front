import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { MaMailModule } from '@monorepo/mail';

@Component({
  selector: 'ca-admin-mails-page',
  templateUrl: './ca-admin-mails-page.component.html',
  styleUrl: './ca-admin-mails-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MaMailModule],
})
export class CaAdminMailsPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('mails')}`);
  }
}
