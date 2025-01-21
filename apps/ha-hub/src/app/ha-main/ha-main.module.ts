import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HaMainComponent } from './ha-main/ha-main.component';
import { HaMainRoutingModule } from './ha-main-routing-module';
import { TranslateModule } from '@ngx-translate/core';
import { HaCoreModule } from '../ha-core/ha-core.module';
import { HaLoginPageComponent } from './ha-login-page/ha-login-page.component';
import { HaLoggedInHomeComponent } from './ha-logged-in-home/ha-logged-in-home.component';
import { HaCookieConsentComponent } from './ha-cookie-consent/ha-cookie-consent.component';
import { HaIconsPageComponent } from '../ha-icon/component/ha-icons-page/ha-icons-page.component';
import { HaIconModule } from '../ha-icon/ha-icon.module';
import { HaBigScreenMainComponent } from './ha-big-screen-main/ha-big-screen-main.component';
import { HaSmallScreenMainComponent } from './ha-small-screen-main/ha-small-screen-main.component';
import { HaGithubStarButtonComponent } from '../ha-core/ha-component/ha-github-star-button/ha-github-star-button.component';
import { HaFairOpenAccessModule } from '../ha-fair-open-access/ha-fair-open-access.module';
import { HaNotLoggedInHomeComponent } from './ha-not-logged-in-home/ha-not-logged-in-home.component';
import { HaHomeComponent } from './ha-home/ha-home.component';
import { HaEmailSignUpComponent } from '../ha-core/ha-component/ha-email-sign-up/ha-email-sign-up.component';

@NgModule({
  declarations: [
    HaMainComponent,
    HaLoginPageComponent,
    HaLoggedInHomeComponent,
    HaCookieConsentComponent,
    HaIconsPageComponent,
    HaBigScreenMainComponent,
    HaSmallScreenMainComponent,
    HaNotLoggedInHomeComponent,
    HaHomeComponent,
  ],
  imports: [
    CommonModule,
    HaMainRoutingModule,
    TranslateModule,
    HaCoreModule,
    HaIconModule,
    HaFairOpenAccessModule,
    NgOptimizedImage,
    HaGithubStarButtonComponent,
    HaEmailSignUpComponent,
  ],
})
export class HaMainModule {}
