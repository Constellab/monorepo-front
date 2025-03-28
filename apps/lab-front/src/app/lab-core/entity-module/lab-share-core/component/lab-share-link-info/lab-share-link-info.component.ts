import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';
import { LabShareLink } from '../../../../model/entities/lab-share.entity';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

/**
 * Simple component to show the validity and user of a share link
 */
@Component({
  selector: 'lab-share-link-info',
  imports: [FlDateModule, TranslatePipe, MatTooltip, NgClass, FlUserModule],
  templateUrl: './lab-share-link-info.component.html',
  styleUrl: './lab-share-link-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabShareLinkInfoComponent {
  shareLink = input.required<LabShareLink>();
}
