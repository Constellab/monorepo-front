import {Component, Input, OnInit} from '@angular/core';
import {FlUserConfig, FlUserProfilePictureSize} from '@monorepo/front-core-lib';
import {CoUser} from '../../model/co-user.class';

@Component({
  selector: 'co-user-profile-picture',
  templateUrl: './co-user-profile-picture.component.html',
  styleUrl: './co-user-profile-picture.component.scss'
})
export class CoUserProfilePictureComponent implements OnInit {

  /**
   * Default size, if number is provided it will be used as rem
   */
  @Input() size: FlUserProfilePictureSize = 'medium';
  circleSize: string;
  fontSize: string;
  initials: string;
  imgSrc?: string;

  constructor(private userConfig: FlUserConfig) {
  }

  @Input({required: true}) set user(user: CoUser) {
    this.setUser(user);
  }

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
        this.circleSize = this.size + 'rem';
        this.fontSize = (this.size / 4) + 'rem';
    }

  }

  private setUser(user: CoUser): void {
    if (user) {
      this.initials = user.alias?.charAt(0);
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
