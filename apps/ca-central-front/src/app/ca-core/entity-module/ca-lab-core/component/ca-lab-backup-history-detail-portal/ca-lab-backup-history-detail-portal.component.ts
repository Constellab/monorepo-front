import { Component, inject } from '@angular/core';
import { CnLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';

@Component({
    selector: 'ca-lab-backup-history-detail-portal',
    templateUrl: './ca-lab-backup-history-detail-portal.component.html',
    styleUrl: './ca-lab-backup-history-detail-portal.component.scss',
    standalone: false
})
export class CaLabBackupHistoryDetailPortalComponent {
  detail: CnLabBackupHistoryDetail = inject(FL_PORTAL_DATA);
}
