import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { LmlBrickService } from '../../lml-brick.service';
import { LmlBrickVersion } from '../../model/lml-brick.class';

export interface LmlBrickVersionDetailDialogInput {
  brickName: string;
  brickVersion: string;
}

/**
 * Simple dialog to load brick version detail and show it
 */
@Component({
  selector: 'lml-brick-version-detail-dialog',
  templateUrl: './lml-brick-version-detail-dialog.component.html',
  styleUrls: ['./lml-brick-version-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlBrickVersionDetailDialogComponent {
  input: LmlBrickVersionDetailDialogInput = inject(MAT_DIALOG_DATA);
  private brickService = inject(LmlBrickService);

  brickVersion$: Observable<LmlBrickVersion> = this.brickService.getBrickVersion(
    this.input.brickName,
    this.input.brickVersion
  );
}
