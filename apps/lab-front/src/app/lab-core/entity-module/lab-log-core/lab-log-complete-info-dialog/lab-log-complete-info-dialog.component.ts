import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LabLogCompleteInfo } from '../../../model/entities/lab-log.entity';
import { LabLogService } from '../../../entity-service/lab-log.service';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabLogCompleteInfoComponent } from '../lab-log-complete-info/lab-log-complete-info.component';

export interface LabLogCompleteInfoDialogInput {
  logName: string;
}

@Component({
  selector: 'lab-log-complete-info-dialog',
  templateUrl: './lab-log-complete-info-dialog.component.html',
  styleUrls: ['./lab-log-complete-info-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, LabLogCompleteInfoComponent],
})
export class LabLogCompleteInfoDialogComponent implements OnInit {
  private input = inject<LabLogCompleteInfoDialogInput>(MAT_DIALOG_DATA);
  private logService = inject(LabLogService);

  logName: string;

  labLogCompleteInfo$: Observable<LabLogCompleteInfo>;

  ngOnInit(): void {
    this.logName = this.input.logName;
    this.labLogCompleteInfo$ = this.logService.getCompleteLog(this.input.logName);
  }
}
