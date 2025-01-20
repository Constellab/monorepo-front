import { Component, Inject } from '@angular/core';
import {
  FL_PORTAL_DATA,
  FlClipboardService,
  FlOverlayRef,
  FlSnackBarService,
} from '@monorepo/front-core-lib';
import { CoIcon } from '@monorepo/community-lib';

@Component({
    selector: 'ha-icon-info-portal',
    templateUrl: './ha-icon-info-portal.component.html',
    styleUrls: ['./ha-icon-info-portal.component.scss'],
    standalone: false
})
export class HaIconInfoPortalComponent {
  icon: CoIcon;

  constructor(
    @Inject(FL_PORTAL_DATA) icon: CoIcon,
    private readonly overlayRef: FlOverlayRef,
    private readonly snackBarService: FlSnackBarService,
    private readonly clipboardService: FlClipboardService
  ) {
    this.icon = icon;
  }

  closeRefAndOpenDeleteDialog(): void {
    this.overlayRef.dispose({ res: 'DELETE', icon: this.icon });
  }

  closeRefAndOpenEditDialog(): void {
    this.overlayRef.dispose({ res: 'EDIT', icon: this.icon });
  }

  copyTechnicalName(): void {
    this.clipboardService.copy(this.icon?.technicalName, {
      text: `technical_name_copied_to_clipboard`,
      translateText: true,
    });
  }
}
