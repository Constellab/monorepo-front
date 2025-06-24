import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiShareLink } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple component to show the validity and user of a share link
 */
@Component({
  selector: 'li-share-link-info',
  imports: [
    FlDateModule,
    TranslatePipe,
    MatTooltip,
    NgClass,
    FlUserModule,
    FlIconModule,
    FlTextIconModule,
    MatIconModule,
  ],
  templateUrl: './li-share-link-info.component.html',
  styleUrl: './li-share-link-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiShareLinkInfoComponent {
  shareLink = input.required<LiShareLink>();
}
