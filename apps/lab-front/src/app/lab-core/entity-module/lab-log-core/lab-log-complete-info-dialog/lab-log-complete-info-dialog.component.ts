import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LabLogCompleteInfo } from '../../../model/entities/lab-log.entity';
import { LabLogService } from '../../../entity-service/lab-log.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LabLogCompleteInfoDialogInput {
  logName: string;
}

@Component({
  selector: 'lab-log-complete-info-dialog',
  templateUrl: './lab-log-complete-info-dialog.component.html',
  styleUrls: ['./lab-log-complete-info-dialog.component.scss'],
  standalone: false,
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
