import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import { CoListItemType } from '../../model/co-list-item-type.enum';
import { CoSpace } from '../../model/co-space.class';
import { CoUser } from '../../model/co-user.class';
import { CoItemTypeIconComponent } from '../co-item-type-icon/co-item-type-icon.component';
import { CoStatsListComponent } from '../co-stats-list/co-stats-list.component';
import { CoTypeBadgeComponent } from '../co-type-badge/co-type-badge.component';
import { CoVisibilityBadgeComponent } from '../co-visibility-badge/co-visibility-badge.component';

@Component({
  selector: 'co-community-list-item',
  templateUrl: './co-community-list-item.component.html',
  styleUrls: ['./co-community-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatIconModule,
    FlIconModule,
    TranslatePipe,
    CoVisibilityBadgeComponent,
    CoTypeBadgeComponent,
    CoItemTypeIconComponent,
    CoStatsListComponent,
    NgOptimizedImage,
  ],
})
export class CoCommunityListItemComponent {
  image = input<string | null>(null);
  type = input.required<CoListItemType>();
  title = input<string | null>(null);
  shortDescription = input<string | null>(null);
  space = input<CoSpace | null>(null);
  showVisibility = input<boolean>(true);
  likes = input<number>(0);
  comments = input<number | undefined>(undefined);
  executions = input<number | undefined>(undefined);
  publishedAt = input<DateTime | null>(null);

  author = input<CoUser | null>(null);

  mainBackground = input<boolean>(false);
  hideDiscover = input<boolean>(false);

  cleanedShortDescription = computed(() => {
    // trim and remove &nbsp; entities
    return this.shortDescription()
      ?.replace(/&nbsp;/g, ' ')
      .trim();
  });
}
