import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {HaMainComponent} from './ha-main/ha-main.component';
import {HaMainRoutingModule} from './ha-main-routing-module';
import {TranslateModule} from '@ngx-translate/core';
import {HaCoreModule} from '../ha-core/ha-core.module';
import {HaLoginPageComponent} from './ha-login-page/ha-login-page.component';
import {HaHomeComponent} from './ha-home/ha-home.component';
import {HaPublicModule} from '../ha-public/ha-public.module';
import {HaStoryModule} from '../ha-story/ha-story.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {HaCookieConsentComponent} from './ha-cookie-consent/ha-cookie-consent.component';
import {HaLiveTaskModule} from '../ha-live-task/ha-live-task.module';
import {HaSpaceModule} from '../ha-space/ha-space.module';
import {HaIconsPageComponent} from '../ha-icon/component/ha-icons-page/ha-icons-page.component';
import {HaIconModule} from '../ha-icon/ha-icon.module';
import {HaBigScreenMainComponent} from './ha-big-screen-main/ha-big-screen-main.component';
import {HaSmallScreenMainComponent} from './ha-small-screen-main/ha-small-screen-main.component';
import {HaProfileModule} from '../ha-profile/ha-profile.module';
import {
    HaGithubStarButtonComponent
} from "../ha-core/ha-component/ha-github-star-button/ha-github-star-button.component";

@NgModule({
  declarations: [
    HaMainComponent,
    HaLoginPageComponent,
    HaHomeComponent,
    HaCookieConsentComponent,
    HaIconsPageComponent,
    HaBigScreenMainComponent,
    HaSmallScreenMainComponent
  ],
    imports: [
        CommonModule,
        HaMainRoutingModule,
        TranslateModule,
        HaCoreModule,
        HaPublicModule,
        HaStoryModule,
        HaSpaceModule,
        HaLiveTaskModule,
        MatSlideToggleModule,
        HaIconModule,
        HaProfileModule,
        NgOptimizedImage,
        HaGithubStarButtonComponent
    ],
})
export class HaMainModule {}
