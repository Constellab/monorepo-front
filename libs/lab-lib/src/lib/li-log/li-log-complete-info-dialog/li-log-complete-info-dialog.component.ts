import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiLogCompleteInfo, LiLogService } from '@monorepo/lab-lib/li-core';
import { LiLogCompleteInfoComponent } from '../li-log-complete-info/li-log-complete-info.component';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface LiLogCompleteInfoDialogInput {
  logName: string;
}

@Component({
  selector: 'li-log-complete-info-dialog',
  templateUrl: './li-log-complete-info-dialog.component.html',
  styleUrls: ['./li-log-complete-info-dialog.component.scss'],
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
