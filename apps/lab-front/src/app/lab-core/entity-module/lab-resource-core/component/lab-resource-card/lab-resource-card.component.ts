import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LabResourceDetailDialogComponent } from '../lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
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
