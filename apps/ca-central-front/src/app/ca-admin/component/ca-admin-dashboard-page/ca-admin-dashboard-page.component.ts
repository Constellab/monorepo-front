import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FlTranslateService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-dashboard-page',
  templateUrl: './ca-admin-dashboard-page.component.html',
  styleUrls: ['./ca-admin-dashboard-page.component.scss']
})
export class CaAdminDashboardPageComponent {

  constructor(titleService: Title,
              translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('admin_dashboard_page')}`);
  }


}
