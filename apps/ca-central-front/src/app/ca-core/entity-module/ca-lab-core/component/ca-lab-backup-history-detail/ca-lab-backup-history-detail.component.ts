import { Component, Input } from '@angular/core';
import { CnLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';
import {
  CaLabBackupHistoryDetailPortalDirective,
} from '../../directive/ca-lab-backup-history-detail-portal.directive';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show a backup history detail short info
 * When hovering the detail, the full detail will be shown
 */
@Component({
  selector: 'ca-lab-backup-history-detail',
  templateUrl: './ca-lab-backup-history-detail.component.html',
  styleUrl: './ca-lab-backup-history-detail.component.scss',
  imports: [
    CaLabBackupHistoryDetailPortalDirective,
    FlStatusModule,
    FlKeyValueModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabBackupHistoryDetailComponent {
  @Input({ required: true }) detail: CnLabBackupHistoryDetail;
}
