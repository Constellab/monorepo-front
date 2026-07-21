import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RvResourceViewBase } from '../../model/rv-resource-view.class';
import { RvViewConfig } from '../../model/rv-view-config.class';

export interface RvResourceViewDialogData {
  resourceId: string;
  view: RvResourceViewBase;
  config: RvViewConfig;
  viewTitle: string;
}

@Component({
  selector: 'rv-resource-view-dialog',
  templateUrl: './rv-resource-view-dialog.component.html',
  styleUrls: ['./rv-resource-view-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RvResourceViewDialogComponent {
  dialogInput: RvResourceViewDialogData = inject(MAT_DIALOG_DATA);

  isLoading: boolean = false;
  error: boolean = false;
}
