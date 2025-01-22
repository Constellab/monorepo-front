import { Component, Input } from '@angular/core';
import { CnLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';
import { CaLabBackupHistoryDetailPortalDirective } from '../../directive/ca-lab-backup-history-detail-portal.directive';
import { FlStatusModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
