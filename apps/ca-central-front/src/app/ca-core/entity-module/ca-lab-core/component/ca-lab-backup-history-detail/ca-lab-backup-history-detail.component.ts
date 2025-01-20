import { Component, Input } from '@angular/core';
import { CnLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';

/**
 * Component to show a backup history detail short info
 * When hovering the detail, the full detail will be shown
 */
@Component({
    selector: 'ca-lab-backup-history-detail',
    templateUrl: './ca-lab-backup-history-detail.component.html',
    styleUrl: './ca-lab-backup-history-detail.component.scss',
    standalone: false
})
export class CaLabBackupHistoryDetailComponent {
  @Input({ required: true }) detail: CnLabBackupHistoryDetail;
}
