import { Component, Input, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LabTypeDialogComponent, LabTypeDialogInput } from '../lab-type-dialog/lab-type-dialog.component';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Icon button to load and show process type detail in a portal on clic
 */
@Component({
  selector: 'lab-type-show-detail-button',
  templateUrl: './lab-type-show-detail-button.component.html',
  styleUrls: ['./lab-type-show-detail-button.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, TranslatePipe],
})
export class LabTypeShowDetailButtonComponent {
  private dialogService = inject(FlDialogService);

  @Input() typingName: string;

  showDetail(): void {
    const data: LabTypeDialogInput = {
      typingName: this.typingName,
    };
    this.dialogService.openMediumDialog(LabTypeDialogComponent, {
      data: data,
      panelClass: 'g-dialog-main-background',
    });
  }
}
