import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiVEnvCompleteInfo, LiVenvService } from '@monorepo/lab-lib/li-core';
import { LiVenvCompleteInfoComponent } from '../li-venv-complete-info/li-venv-complete-info.component';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface LiVenvDetailDialogInput {
  venvName: string;
}

@Component({
  selector: 'li-venv-detail-dialog',
  templateUrl: './li-venv-detail-dialog.component.html',
  styleUrls: ['./li-venv-detail-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, FlSectionModule, LiVenvCompleteInfoComponent],
})
export class LiVenvDetailDialogComponent {
  private input = inject<LiVenvDetailDialogInput>(MAT_DIALOG_DATA);
  private venvService = inject(LiVenvService);

  venvName: string;

  venvCompleteInfo$: Observable<LiVEnvCompleteInfo> = this.venvService.getVenvInfo(this.input.venvName);

  constructor() {
    const input = this.input;

    this.venvName = input.venvName;
  }
}
