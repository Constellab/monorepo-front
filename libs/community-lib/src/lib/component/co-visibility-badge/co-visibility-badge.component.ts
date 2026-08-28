import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ClStringHelper } from '@monorepo/core-lib';
import { TranslatePipe } from '@ngx-translate/core';

import { CoSpace } from '../../model/co-space.class';
import { CoConfig } from '../../service/co-service-config.config';

@Component({
  selector: 'co-visibility-badge',
  templateUrl: './co-visibility-badge.component.html',
  styleUrls: ['./co-visibility-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, MatIconModule, NgOptimizedImage],
})
export class CoVisibilityBadgeComponent {
  private coServiceConfig = inject(CoConfig);

  space = input<CoSpace | null | undefined>(null);

  size = input<'small' | 'medium'>('small');

  iconSize = computed(() => {
    return this.size() === 'small' ? '11.3px' : '16.12px';
  });

  textSize = computed(() => {
    return this.size() === 'small' ? '10px' : '14px';
  });

  spacePhoto = computed(() => {
    const photo = this.space()?.photo;
    if (photo && !ClStringHelper.isHttpLink(photo)) {
      return this.coServiceConfig.getSpacePhotoUrl(photo);
    }
    return photo;
  });
}
