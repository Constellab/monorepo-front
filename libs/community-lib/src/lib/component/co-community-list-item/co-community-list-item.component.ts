import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CoSpace } from '../../model/co-space.class';
import { CoItemTypeIconComponent } from '../co-item-type-icon/co-item-type-icon.component';
import { CoStatsListComponent } from '../co-stats-list/co-stats-list.component';
import { CoTypeBadgeComponent } from '../co-type-badge/co-type-badge.component';
import { CoVisibilityBadgeComponent } from '../co-visibility-badge/co-visibility-badge.component';

@Component({
  selector: 'co-community-list-item',
  templateUrl: './co-community-list-item.component.html',
  styleUrls: ['./co-community-list-item.component.scss'],
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
  image = input<string>(null);
  type = input.required<'app' | 'brick' | 'agent' | 'story' | 'tag'>();
  title = input<string>(null);
  shortDescription = input<string>(null);
  space = input<CoSpace>(null);
  showVisibility = input<boolean>(true);
  likes = input<number>(0);
  comments = input<number>(undefined);
  executions = input<number>(undefined);
}
