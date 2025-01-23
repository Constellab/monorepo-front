import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LabResourceDetailDialogComponent } from '../lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-resource-card',
  templateUrl: './lab-resource-card.component.html',
  styleUrls: ['./lab-resource-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlCardModule, MatIconButton, MatTooltip, MatIcon, FlIconModule, FlDateModule, TranslatePipe],
})
export class LabResourceCardComponent implements OnInit {
  private dialogService = inject(FlDialogService);

  @Input() resource: LabResource;

  ngOnInit(): void {}

  openResourceDetail(): void {
    this.dialogService.openBigDialog(LabResourceDetailDialogComponent, {
      data: this.resource.id,
      panelClass: 'g-dialog-main-background',
      closeOnNavigation: true,
    });
  }
}
