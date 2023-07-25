import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FlTranslateService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-admin-lab-instances-page',
  templateUrl: './ca-admin-lab-instances-page.component.html',
  styleUrls: ['./ca-admin-lab-instances-page.component.scss']
})
export class CaAdminLabInstancesPageComponent {

  constructor(titleService: Title,
              translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('lab_instances')}`);
  }

}
