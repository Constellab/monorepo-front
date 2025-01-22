import { Component, OnInit, inject } from '@angular/core';
import { LabVenvService } from '../../../entity-service/lab-venv.service';
import { Observable } from 'rxjs';
import { LabVEnvCompleteInfo } from '../../../model/entities/lab-venv.entity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LabVenvDetailDialogInput {
  venvName: string;
}

@Component({
  selector: 'lab-venv-detail-dialog',
  templateUrl: './lab-venv-detail-dialog.component.html',
  styleUrls: ['./lab-venv-detail-dialog.component.scss'],
  standalone: false,
})
export class LabVenvDetailDialogComponent implements OnInit {
  private input = inject<LabVenvDetailDialogInput>(MAT_DIALOG_DATA);
  private venvService = inject(LabVenvService);

  venvName: string;

  venvCompleteInfo$: Observable<LabVEnvCompleteInfo> = this.venvService.getVenvInfo(this.input.venvName);

  constructor() {
    const input = this.input;

    this.venvName = input.venvName;
  }

  ngOnInit(): void {}
}
