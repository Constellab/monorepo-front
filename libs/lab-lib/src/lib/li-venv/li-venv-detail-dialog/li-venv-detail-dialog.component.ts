import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiVEnvCompleteInfo, LiVenvService } from '@monorepo/lab-lib/li-core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiVenvCompleteInfoComponent } from '../li-venv-complete-info/li-venv-complete-info.component';
import {
  LiVenvPackageListDialogComponent,
  LiVenvPackageListDialogInput,
} from '../li-venv-package-list-dialog/li-venv-package-list-dialog.component';

export interface LiVenvDetailDialogInput {
  venvName: string;
}

@Component({
  selector: 'li-venv-detail-dialog',
  templateUrl: './li-venv-detail-dialog.component.html',
  styleUrls: ['./li-venv-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    FlSectionModule,
    LiVenvCompleteInfoComponent,
    TranslateModule,
  ],
})
export class LiVenvDetailDialogComponent {
  private input = inject<LiVenvDetailDialogInput>(MAT_DIALOG_DATA);
  private venvService = inject(LiVenvService);
  private dialogService = inject(FlDialogService);

  venvName: string;

  venvCompleteInfo$: Observable<LiVEnvCompleteInfo> = this.venvService.getVenvInfo(this.input.venvName);

  constructor() {
    const input = this.input;

    this.venvName = input.venvName;
  }

  openPackageListDialog(): void {
    this.dialogService.openMediumDialog(LiVenvPackageListDialogComponent, {
      data: {
        venvName: this.venvName,
      } as LiVenvPackageListDialogInput,
    });
  }
}
