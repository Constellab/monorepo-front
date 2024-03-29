import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FlTranslateService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-server-page',
  templateUrl: './ca-admin-server-page.component.html',
  styleUrls: ['./ca-admin-server-page.component.scss'],
})
export class CaAdminServerPageComponent {

  constructor(titleService: Title,
              translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('servers')}`);
  }

}
