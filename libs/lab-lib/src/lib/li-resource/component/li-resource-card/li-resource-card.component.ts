import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiResource } from '@monorepo/lab-lib/li-core';
import { LiResourceDetailDialogComponent } from '../li-resource-detail-dialog/li-resource-detail-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-resource-card',
  templateUrl: './li-resource-card.component.html',
  styleUrls: ['./li-resource-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlCardModule, MatIconButton, MatTooltip, MatIcon, FlIconModule, FlDateModule, TranslatePipe],
})
export class LiResourceCardComponent {
  private dialogService = inject(FlDialogService);

  @Input() resource: LiResource;

  openResourceDetail(): void {
    this.dialogService.openBigDialog(LiResourceDetailDialogComponent, {
      data: this.resource.id,
      panelClass: 'g-dialog-main-background',
      closeOnNavigation: true,
    });
  }
}
