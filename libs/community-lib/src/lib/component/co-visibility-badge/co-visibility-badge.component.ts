import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CoSpace } from '../../model/co-space.class';

@Component({
  selector: 'co-visibility-badge',
  templateUrl: './co-visibility-badge.component.html',
  styleUrls: ['./co-visibility-badge.component.scss'],
  imports: [TranslatePipe, MatIconModule],
})
export class CoVisibilityBadgeComponent {
  space = input<CoSpace>(null);

  size = input<'small' | 'medium'>('small');

  iconSize = computed(() => {
    return this.size() === 'small' ? '11.3px' : '16.12px';
  });

  textSize = computed(() => {
    return this.size() === 'small' ? '10px' : '14px';
  });

  // get spacePhoto(): string {
  //   if (this.space && this.space.photo && !ClStringHelper.isHttpLink(this.space.photo)) {
  //     this.space.photo = this.coServiceConfig.getSpacePhotoUrl(this.space.photo);
  //   }
  //   return this.space.photo;
  // }
}
