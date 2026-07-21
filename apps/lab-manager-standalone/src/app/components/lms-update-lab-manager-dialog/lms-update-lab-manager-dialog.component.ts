import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LmlLabManagerLibModule, LmlLabManagerMigrationPlanDTO } from '@monorepo/lab-manager-lib';

import { LmsLabService } from '../../service/lms-lab.service';

@Component({
  selector: 'lms-update-lab-manager-dialog',
  imports: [FlDialogModule, FlTranslateModule, AsyncPipe, FlKeyValueModule, LmlLabManagerLibModule],
  templateUrl: './lms-update-lab-manager-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lms-update-lab-manager-dialog.component.scss',
})
export class LmsUpdateLabManagerDialogComponent {
  input: LmlLabManagerMigrationPlanDTO = inject(MAT_DIALOG_DATA);
  private labService = inject(LmsLabService);

  command$ = this.labService.getUpdateLabManagerCommand();
}
