import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlOverlayRef, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaIcon} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';

@Component({
  selector: 'ha-icon-info-portal',
  templateUrl: './ha-icon-info-portal.component.html',
  styleUrls: ['./ha-icon-info-portal.component.scss']
})
export class HaIconInfoPortalComponent {

  icon: HaIcon;

  constructor(@Inject(FL_PORTAL_DATA) icon: HaIcon,
              private readonly overlayRef: FlOverlayRef,
              private readonly snackBarService: FlSnackBarService) {
    this.icon = icon;
  }

  closeRefAndOpenDeleteDialog(): void {
    this.overlayRef.dispose({res: 'DELETE', icon: this.icon});
  }

  closeRefAndOpenEditDialog(): void {
    this.overlayRef.dispose({res: 'EDIT', icon: this.icon});
  }

  copyTechnicalName(): void {
    navigator.clipboard.writeText(this.icon?.technicalName).then(() => {
      this.snackBarService.openSuccessMessage({text: `technical_name_copied_to_clipboard`, translateText: true});
    }).catch(() => {
      this.snackBarService.openErrorMessage('Error copying code to clipboard');
    });
  }
}
