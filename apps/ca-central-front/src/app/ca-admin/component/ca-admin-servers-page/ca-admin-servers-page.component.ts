import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FlTranslateService} from '@monorepo/front-core-lib';

/**
 * Page to manager cloud providers, object storage, servers
 */
@Component({
  selector: 'ca-admin-servers-page',
  templateUrl: './ca-admin-servers-page.component.html',
  styleUrls: ['./ca-admin-servers-page.component.scss']
})
export class CaAdminServersPageComponent {

  constructor(titleService: Title,
              translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('admin_servers_page')}`);
  }

}
