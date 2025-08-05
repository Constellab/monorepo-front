import { Component, inject, OnInit } from '@angular/core';

import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabBackupHistoryComponent } from '../ca-lab-backup-history/ca-lab-backup-history.component';
import { CaLabBackupsStatusesComponent } from '../ca-lab-backups-statuses/ca-lab-backups-statuses.component';

@Component({
  selector: 'ca-lab-backup-detail-page',
  templateUrl: './ca-lab-backup-detail-page.component.html',
  styleUrls: ['./ca-lab-backup-detail-page.component.scss'],
  imports: [CaLabBackupsStatusesComponent, CaLabBackupHistoryComponent],
})
export class CaLabBackupDetailPageComponent implements OnInit {
  private state = inject(CaLabDetailPageState);

  labId: string;

  ngOnInit(): void {
    this.labId = this.state.getLabId();
  }
}
