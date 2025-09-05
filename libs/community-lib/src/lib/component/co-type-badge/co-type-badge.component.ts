import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CoItemTypeIconComponent } from '../co-item-type-icon/co-item-type-icon.component';

@Component({
  selector: 'co-type-badge',
  templateUrl: './co-type-badge.component.html',
  styleUrls: ['./co-type-badge.component.scss'],
  imports: [TranslatePipe, MatIconModule, FlIconModule, CoItemTypeIconComponent],
})
export class CoTypeBadgeComponent {
  type = input.required<'app' | 'brick' | 'agent' | 'story'>();

  typeStr = computed(() => {
    switch (this.type()) {
      case 'app':
        return 'coCommunityLib.apps';
      case 'brick':
        return 'coCommunityLib.bricks';
      case 'agent':
        return 'coCommunityLib.agents';
      case 'story':
        return 'coCommunityLib.stories';
    }
  });
}
