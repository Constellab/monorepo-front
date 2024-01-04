import {Component} from '@angular/core';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {Location} from '@angular/common';
import {HaConstellabHelper} from '../../ha-core/ha-model/ha-config/ha-constellab.helper';

@Component({
  selector: 'ha-login-page',
  templateUrl: './ha-login-page.component.html',
  styleUrls: ['./ha-login-page.component.scss']
})
export class HaLoginPageComponent {

  spaceSignupRoute: string = HaConstellabHelper.getConstellabSignupUrl();


  constructor(private location: Location,
              private authenticatedUserService: HaAuthenticatedUserService) {
  }

  onLoginSuccess(): void {
    this.authenticatedUserService.init();
    this.location.back();
  }

}
