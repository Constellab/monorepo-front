import {Component, Input, OnInit} from '@angular/core';
import {FlUserConfig} from '../../service/fl-user-config.config';
import {FlUser} from '../../model/fl-user.class';


export type FlUserProfilePictureSize = 'small' | 'medium' | 'big' | number;

@Component({
  selector: 'fl-user-profile-picture',
  templateUrl: './fl-user-profile-picture.component.html',
  styleUrls: ['./fl-user-profile-picture.component.scss']
})
export class FlUserProfilePictureComponent implements OnInit {

  @Input({required: true}) set user(user: FlUser) {
    this.setUser(user);
  }

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

  private setUser(user: FlUser): void {


    if (user) {

      this.initials = (user.firstname?.charAt(0) ?? '') + (user.lastname?.charAt(0) ?? '');

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
