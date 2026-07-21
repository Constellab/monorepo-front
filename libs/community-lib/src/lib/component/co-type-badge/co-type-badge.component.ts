import { ChangeDetectionStrategy,Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CoListItemType } from '../../model/co-list-item-type.enum';
import { CoItemTypeIconComponent } from '../co-item-type-icon/co-item-type-icon.component';

@Component({
  selector: 'co-type-badge',
  templateUrl: './co-type-badge.component.html',
  styleUrls: ['./co-type-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, MatIconModule, FlIconModule, CoItemTypeIconComponent],
})
export class CoTypeBadgeComponent {
  type = input.required<CoListItemType>();

  typeStr = computed(() => {
    switch (this.type()) {
      case CoListItemType.APP:
        return 'coCommunityLib.apps';
      case CoListItemType.BRICK:
        return 'coCommunityLib.bricks';
      case CoListItemType.AGENT:
        return 'coCommunityLib.agents';
      case CoListItemType.STORY:
        return 'coCommunityLib.stories';
      case CoListItemType.TAG:
        return 'coCommunityLib.tags';
      case CoListItemType.PARTNER:
        return 'coCommunityLib.partners';
    }
  });
}
