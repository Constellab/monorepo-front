import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FlTranslateService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-server-info-page',
  templateUrl: './ca-admin-server-info-page.component.html',
  styleUrls: ['./ca-admin-server-info-page.component.scss'],
})
export class CaAdminServerInfoPageComponent {
  constructor(titleService: Title,
              translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('server_info_list')}`);
  }

}
