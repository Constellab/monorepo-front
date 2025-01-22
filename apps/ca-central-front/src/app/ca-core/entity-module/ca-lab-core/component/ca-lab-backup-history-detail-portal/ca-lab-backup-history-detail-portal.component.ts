import { Component, inject } from '@angular/core';
import { CnLabBackupHistoryDetail } from '../../../../model/entities/lab/ca-lab-backup.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';
import { FlPortalModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-portal/fl-portal.module';
import { FlStatusModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
