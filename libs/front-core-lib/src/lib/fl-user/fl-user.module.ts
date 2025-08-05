import { CommonModule } from '@angular/common';
import { inject,ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDateModule } from '../fl-date/fl-date.module';
import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlCreationInfoComponent } from './component/fl-creation-info/fl-creation-info.component';
import { FlLastModificationInfoComponent } from './component/fl-last-modification-info/fl-last-modification-info.component';
import { FlSelectUserComponent } from './component/fl-select-user/fl-select-user.component';
import { FlUserInfoPortalComponent } from './component/fl-user-info-portal/fl-user-info-portal.component';
import { FlUserInlineComponent } from './component/fl-user-inline/fl-user-inline.component';
import { FlUserProfilePictureComponent } from './component/fl-user-profile-picture/fl-user-profile-picture.component';
import { FlUserWithDateComponent } from './component/fl-user-with-date/fl-user-with-date.component';
import { FlUserMouseHoverPortalDirective } from './directive/fl-user-mouse-hover-portal/fl-user-mouse-hover-portal.directive';
import { flUserI18n } from './fl-user.i18n';
import { FlUserConfig } from './service/fl-user-config.config';

@NgModule({
  declarations: [
    FlUserProfilePictureComponent,
    FlUserInlineComponent,
    FlUserWithDateComponent,
    FlUserMouseHoverPortalDirective,
    FlUserInfoPortalComponent,
    FlCreationInfoComponent,
    FlLastModificationInfoComponent,
    FlSelectUserComponent,
  ],
  exports: [
    FlUserProfilePictureComponent,
    FlUserInlineComponent,
    FlUserWithDateComponent,
    FlUserMouseHoverPortalDirective,
    FlUserInfoPortalComponent,
    FlCreationInfoComponent,
    FlLastModificationInfoComponent,
    FlSelectUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule,

    FlTextIconModule,
    FlTranslateModule,
    FlDateModule,
    FlInputSearchModule,
    FlPortalModule,
  ],
})
export class FlUserModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlUserModule', flUserI18n);
  }

  public static forRoot(apiServiceConfig: Type<FlUserConfig>): ModuleWithProviders<FlUserModule> {
    const providers: Provider[] = [{ provide: FlUserConfig, useClass: apiServiceConfig }];

    return {
      ngModule: FlUserModule,
      providers: providers,
    };
  }
}
