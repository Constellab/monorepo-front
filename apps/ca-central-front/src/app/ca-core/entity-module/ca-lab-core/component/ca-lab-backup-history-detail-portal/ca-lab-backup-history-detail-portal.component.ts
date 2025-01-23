import { Component, inject } from '@angular/core';
import { CnLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-backup-history-detail-portal',
  templateUrl: './ca-lab-backup-history-detail-portal.component.html',
  styleUrl: './ca-lab-backup-history-detail-portal.component.scss',
  imports: [FlPortalModule, FlStatusModule, FlKeyValueModule, FlCorePipeModule, TranslatePipe],
})
export class CaLabBackupHistoryDetailPortalComponent {
  detail: CnLabBackupHistoryDetail = inject(FL_PORTAL_DATA);
}
