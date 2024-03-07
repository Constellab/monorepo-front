import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA} from '@monorepo/front-core-lib';
import {HaIcon} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import {HaIconService} from '../../../ha-core/ha-service/ha-icon.service';

@Component({
  selector: 'ha-icon-info-portal',
  templateUrl: './ha-icon-info-portal.component.html',
  styleUrls: ['./ha-icon-info-portal.component.scss']
})
export class HaIconInfoPortalComponent {

  icon: HaIcon;

  constructor(@Inject(FL_PORTAL_DATA) icon: HaIcon,
              private iconService: HaIconService) {
    this.icon = icon;
  }
}
