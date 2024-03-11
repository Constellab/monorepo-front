import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlOverlayRef} from '@monorepo/front-core-lib';
import {HaIcon} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';

@Component({
  selector: 'ha-icon-info-portal',
  templateUrl: './ha-icon-info-portal.component.html',
  styleUrls: ['./ha-icon-info-portal.component.scss']
})
export class HaIconInfoPortalComponent {

  icon: HaIcon;

  constructor(@Inject(FL_PORTAL_DATA) icon: HaIcon,
              private readonly overlayRef: FlOverlayRef) {
    this.icon = icon;
  }

  closeRefAndOpenDeleteDialog(): void {
    this.overlayRef.dispose(this.icon);
  }
}
