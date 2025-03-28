import { Component, Input, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LiTypeDialogComponent, LiTypeDialogInput } from '../li-type-dialog/li-type-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Icon button to load and show process type detail in a portal on clic
 */
@Component({
  selector: 'li-type-show-detail-button',
  templateUrl: './li-type-show-detail-button.component.html',
  styleUrls: ['./li-type-show-detail-button.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, TranslatePipe],
})
export class LiTypeShowDetailButtonComponent {
  private dialogService = inject(FlDialogService);

  @Input() typingName: string;

  showDetail(): void {
    const data: LiTypeDialogInput = {
      typingName: this.typingName,
    };
    this.dialogService.openMediumDialog(LiTypeDialogComponent, {
      data: data,
      panelClass: 'g-dialog-main-background',
    });
  }
}
