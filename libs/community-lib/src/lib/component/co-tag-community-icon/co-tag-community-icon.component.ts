import { Component, computed, input } from '@angular/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { CoCommunityHelperService } from '../../helper/co-community-helper.service';

export interface CoTagCommunityTagInput {
  id: string;
  key: string;
}

@Component({
  selector: 'co-tag-community-tag',
  imports: [FlIconModule, MatIcon, MatTooltip, TranslatePipe],
  templateUrl: './co-tag-community-icon.component.html',
  styleUrl: './co-tag-community-icon.component.scss',
})
export class CoTagCommunityIconComponent {
  private communityHelperService = new CoCommunityHelperService();

  key = input.required<CoTagCommunityTagInput>();

  size = input<'small' | 'normal' | 'big'>('normal');

  sizeClass = computed(() => {
    const size = this.size();
    if (size === 'small') {
      return 'g-icon-small';
    } else if (size === 'big') {
      return 'g-icon-big';
    }
    return '';
  });

  communityTagPageUrl = computed(() => {
    const key = this.key();
    return this.communityHelperService.getCommunityTagUrl(key);
  });
}
