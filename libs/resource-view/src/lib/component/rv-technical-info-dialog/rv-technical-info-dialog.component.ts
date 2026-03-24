import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RvTechnicalInfo } from '../../model/rv-technical-info.class';

/**
 * Dialog to show technical information about a resource or a view
 */
@Component({
  selector: 'rv-technical-info-dialog',
  templateUrl: './rv-technical-info-dialog.component.html',
  styleUrls: ['./rv-technical-info-dialog.component.scss'],
  standalone: false,
})
export class RvTechnicalInfoDialogComponent {
  technicalInfo: RvTechnicalInfo[];

  constructor() {
    const technicalInfo = inject(MAT_DIALOG_DATA);

    this.technicalInfo = technicalInfo;
  }
}
