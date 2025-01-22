import { Component, inject } from '@angular/core';
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
  standalone: false,
})
export class HaIconInfoPortalComponent {
  private readonly overlayRef = inject(FlOverlayRef);
  private readonly snackBarService = inject(FlSnackBarService);
  private readonly clipboardService = inject(FlClipboardService);

  icon: CoIcon;

  constructor() {
    const icon = inject<CoIcon>(FL_PORTAL_DATA);

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
