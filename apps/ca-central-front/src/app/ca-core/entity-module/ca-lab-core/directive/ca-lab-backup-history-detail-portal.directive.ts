import { Directive, Input } from '@angular/core';
import { FlMouseHoverPortalAbstractDirective, FlMouseHoverPortalConfig } from '@monorepo/front-core-lib';
import { CnLabBackupHistoryDetail } from '../../../model/entities/lab/ca-lab-backup.class';
import { CaLabBackupHistoryDetailPortalComponent } from '../component/ca-lab-backup-history-detail-portal/ca-lab-backup-history-detail-portal.component';

/**
 * Specific directive to open the backup history detail portal
 */
@Directive({
    selector: '[caLabBackupHistoryDetailPortal]',
    standalone: false
})
export class CaLabBackupHistoryDetailPortalDirective extends FlMouseHoverPortalAbstractDirective {
  @Input() caLabBackupHistoryDetailPortal: CnLabBackupHistoryDetail;

  getConfig(): FlMouseHoverPortalConfig | null {
    return {
      data: this.caLabBackupHistoryDetailPortal,
      position: ['bottom', 'top', 'left', 'right'],
      component: CaLabBackupHistoryDetailPortalComponent,
      portalTagName: 'CA-LAB-BACKUP-HISTORY-DETAIL-PORTAL',
      overlayConfig: {
        disposeOnNavigation: true,
      },
    };
  }

  onPortalClosed(): void {}

  onPortalOpened(): void {}
}
