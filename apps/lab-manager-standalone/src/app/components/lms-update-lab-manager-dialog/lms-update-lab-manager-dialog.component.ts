import { Component, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LmsLabService } from '../../service/lms-lab.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LmlNewVersionAvailable } from '@monorepo/lab-manager-lib';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lms-update-lab-manager-dialog',
  imports: [FlDialogModule, FlTranslateModule, AsyncPipe, FlKeyValueModule],
  templateUrl: './lms-update-lab-manager-dialog.component.html',
  styleUrl: './lms-update-lab-manager-dialog.component.scss',
})
export class LmsUpdateLabManagerDialogComponent {
  input: LmlNewVersionAvailable = inject(MAT_DIALOG_DATA);
  private labService = inject(LmsLabService);

  command$ = this.labService.getUpdateLabManagerCommand();
}
