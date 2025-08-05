import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';

import { CaStatusHistory } from '../../../model/entities/ca-status-history.class';
import { CaStatusHistoryCardComponent } from '../ca-status-history-card/ca-status-history-card.component';

export interface CaStatusHistoryListDialogInput {
  statusHistoriesObs: FlArrayObs<CaStatusHistory<any>>;
}

/**
 * Dialog to get and display the list of status history for an entity
 */
@Component({
  selector: 'ca-status-history-list-dialog',
  templateUrl: './ca-status-history-list-dialog.component.html',
  styleUrls: ['./ca-status-history-list-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    CaStatusHistoryCardComponent,
    MatDivider,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslatePipe,
  ],
})
export class CaStatusHistoryListDialogComponent implements OnInit {
  private dialogInput = inject<CaStatusHistoryListDialogInput>(MAT_DIALOG_DATA);

  statusHistories: FlArrayObs<CaStatusHistory<any>>;

  ngOnInit(): void {
    this.statusHistories = this.dialogInput.statusHistoriesObs;
  }
}
