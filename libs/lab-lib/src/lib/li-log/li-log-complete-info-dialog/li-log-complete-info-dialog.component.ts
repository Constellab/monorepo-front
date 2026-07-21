import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiLogCompleteInfo, LiLogService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiLogCompleteInfoComponent } from '../li-log-complete-info/li-log-complete-info.component';

export interface LiLogCompleteInfoDialogInput {
  logName: string;
}

@Component({
  selector: 'li-log-complete-info-dialog',
  templateUrl: './li-log-complete-info-dialog.component.html',
  styleUrls: ['./li-log-complete-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, LiLogCompleteInfoComponent],
})
export class LiLogCompleteInfoDialogComponent implements OnInit {
  private input = inject<LiLogCompleteInfoDialogInput>(MAT_DIALOG_DATA);
  private logService = inject(LiLogService);

  logName: string;

  labLogCompleteInfo$: Observable<LiLogCompleteInfo>;

  ngOnInit(): void {
    this.logName = this.input.logName;
    this.labLogCompleteInfo$ = this.logService.getCompleteLog(this.input.logName);
  }
}
