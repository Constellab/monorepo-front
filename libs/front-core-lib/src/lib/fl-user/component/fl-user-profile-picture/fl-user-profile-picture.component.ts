import { Component, inject, Input, input, OnInit } from '@angular/core';

import { FlUser } from '../../model/fl-user.class';
import { FlUserConfig } from '../../service/fl-user-config.config';

export type FlUserProfilePictureSize = 'small' | 'medium' | 'big' | number;

@Component({
  selector: 'fl-user-profile-picture',
  templateUrl: './fl-user-profile-picture.component.html',
  styleUrls: ['./fl-user-profile-picture.component.scss'],
  standalone: false,
})
export class FlUserProfilePictureComponent implements OnInit {
  private userConfig = inject(FlUserConfig);

  @Input({ required: true }) set user(user: FlUser) {
    this.setUser(user);
  }

  /**
   * Default size, if number is provided it will be used as rem
   */
  @Input() size: FlUserProfilePictureSize = 'medium';

  sizeInPx = input<boolean>(false);

  circleSize: string;

  fontSize: string;

  initials: string;

  imgSrc?: string;

  ngOnInit(): void {
    switch (this.size) {
      case 'small':
        this.circleSize = '28px';
        this.fontSize = '12px';
        break;
      case 'medium':
        // same size as the icon button
        this.circleSize = '40px';
        this.fontSize = '15px';
        break;
      case 'big':
        this.circleSize = '80px';
        this.fontSize = '23px';
        break;
      default:
        this.circleSize = this.size + (this.sizeInPx() ? 'px' : 'rem');
        this.fontSize = this.size / 4 + (this.sizeInPx() ? 'px' : 'rem');
    }
  }

  private setUser(user: FlUser): void {
    if (user) {
      if (user.alias) {
        const spaceIndex = user.alias.indexOf(' ');
        if (spaceIndex !== -1 && user.alias.length > spaceIndex + 1) {
          this.initials = user.alias.charAt(0) + user.alias.charAt(spaceIndex + 1);
        } else {
          this.initials = user.alias.charAt(0);
        }
      } else {
        this.initials = (user.firstname?.charAt(0) ?? '') + (user.lastname?.charAt(0) ?? '');
      }

      if (user.photo) {
        this.imgSrc = this.userConfig.getUserPhotoUrl(user.photo);
      } else {
        this.imgSrc = null;
      }
    } else {
      this.initials = '';
      this.imgSrc = null;
    }
  }
}
