import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiShareLink } from '@monorepo/lab-lib/li-core';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple component to show the validity and user of a share link
 */
@Component({
  selector: 'li-share-link-info',
  imports: [FlDateModule, TranslatePipe, MatTooltip, NgClass, FlUserModule],
  templateUrl: './li-share-link-info.component.html',
  styleUrl: './li-share-link-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiShareLinkInfoComponent {
  shareLink = input.required<LiShareLink>();
}
