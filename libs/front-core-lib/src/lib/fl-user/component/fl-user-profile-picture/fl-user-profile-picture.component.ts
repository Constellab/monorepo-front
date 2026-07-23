import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { FlUser } from '../../model/fl-user.class';
import { FlUserConfig } from '../../service/fl-user-config.config';

export type FlUserProfilePictureSize = 'small' | 'medium' | 'big' | number;

@Component({
  selector: 'fl-user-profile-picture',
  templateUrl: './fl-user-profile-picture.component.html',
  styleUrls: ['./fl-user-profile-picture.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlUserProfilePictureComponent {
  private userConfig = inject(FlUserConfig);

  user = input.required<FlUser>();

  /**
   * Default size, if number is provided it will be used as rem
   */
  size = input<FlUserProfilePictureSize>('medium');

  sizeInPx = input<boolean>(false);

  circleSize = computed<string>(() => {
    const size = this.size();
    switch (size) {
      case 'small':
        return '28px';
      case 'medium':
        // same size as the icon button
        return '40px';
      case 'big':
        return '80px';
      default:
        return size + (this.sizeInPx() ? 'px' : 'rem');
    }
  });

  fontSize = computed<string>(() => {
    const size = this.size();
    switch (size) {
      case 'small':
        return '12px';
      case 'medium':
        return '15px';
      case 'big':
        return '23px';
      default:
        return size / 4 + (this.sizeInPx() ? 'px' : 'rem');
    }
  });

  initials = computed<string>(() => {
    const user = this.user();
    if (!user) {
      return '';
    }

    if (user.alias) {
      const spaceIndex = user.alias.indexOf(' ');
      if (spaceIndex !== -1 && user.alias.length > spaceIndex + 1) {
        return user.alias.charAt(0) + user.alias.charAt(spaceIndex + 1);
      }
      return user.alias.charAt(0);
    }

    return (user.firstname?.charAt(0) ?? '') + (user.lastname?.charAt(0) ?? '');
  });

  imgSrc = computed<string | null>(() => {
    const user = this.user();
    return user?.photo ? this.userConfig.getUserPhotoUrl(user.photo) : null;
  });
}
