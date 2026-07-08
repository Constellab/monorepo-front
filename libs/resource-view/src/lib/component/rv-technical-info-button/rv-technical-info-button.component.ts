import { ChangeDetectionStrategy, Component, inject,Input } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { RvTechnicalInfo } from '../../model/rv-technical-info.class';
import { RvTechnicalInfoDialogComponent } from '../rv-technical-info-dialog/rv-technical-info-dialog.component';

/**
 * Button to open the technical information dialog
 */
@Component({
  selector: 'rv-technical-info-button',
  templateUrl: './rv-technical-info-button.component.html',
  styleUrls: ['./rv-technical-info-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RvTechnicalInfoButtonComponent {
  private dialogService = inject(FlDialogService);

  @Input() technicalInfo: RvTechnicalInfo[];

  hasTechnicalInfo(): boolean {
    return this.technicalInfo?.length > 0;
  }

  openDialog(): void {
    this.dialogService.openMediumDialog(RvTechnicalInfoDialogComponent, { data: this.technicalInfo });
  }
}
