import { Component, inject } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';

@Component({
  selector: 'ca-lab-backup-history-detail-portal',
  templateUrl: './ca-lab-backup-history-detail-portal.component.html',
  styleUrl: './ca-lab-backup-history-detail-portal.component.scss',
  imports: [FlPortalModule, FlStatusModule, FlKeyValueModule, FlCorePipeModule, TranslatePipe],
})
export class CaLabBackupHistoryDetailPortalComponent {
  detail: CaLabBackupHistoryDetail = inject(FL_PORTAL_DATA);
}
