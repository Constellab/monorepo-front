import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LabLogCompleteInfo } from '../../../model/entities/lab-log.entity';
import { LabLogService } from '../../../entity-service/lab-log.service';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { LabLogCompleteInfoComponent } from '../lab-log-complete-info/lab-log-complete-info.component';

export interface LabLogCompleteInfoDialogInput {
  logName: string;
}

@Component({
  selector: 'lab-log-complete-info-dialog',
  templateUrl: './lab-log-complete-info-dialog.component.html',
  styleUrls: ['./lab-log-complete-info-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, FlSectionModule, LabLogCompleteInfoComponent],
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
