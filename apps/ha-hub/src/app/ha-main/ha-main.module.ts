import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HaMainComponent } from './ha-main/ha-main.component';
import { HaMainRoutingModule } from './ha-main-routing-module';
import { TranslateModule } from '@ngx-translate/core';
import { HaCoreModule } from '../ha-core/ha-core.module';
import { HaLoginPageComponent } from './ha-login-page/ha-login-page.component';
import { HaHomeComponent } from './ha-home/ha-home.component';
import { HaPublicModule } from '../ha-public/ha-public.module';
import { HaStoryModule } from '../ha-story/ha-story.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HaCookieConsentComponent } from './ha-cookie-consent/ha-cookie-consent.component';

@NgModule({
  declarations: [
    HaMainComponent,
    HaLoginPageComponent,
    HaHomeComponent,
    HaCookieConsentComponent,
  ],
  imports: [
    CommonModule,
    HaMainRoutingModule,
    TranslateModule,
    HaCoreModule,
    HaPublicModule,
    HaStoryModule,
    MatSlideToggleModule,
  ],
})
export class HaMainModule {}
