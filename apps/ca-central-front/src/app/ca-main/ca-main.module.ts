import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CaMainAppComponent} from './component/ca-main-app/ca-main-app.component';
import {CaMainRoutingModule} from './ca-main-routing.module';
import {CaCoreModule} from '../ca-core/ca-core.module';
import {CaNotificationsModule} from '../ca-notifications/ca-notifications.module';
import {CaMySpacesPortalComponent} from './component/ca-my-spaces-portal/ca-my-spaces-portal.component';
import {CaSpaceCoreModule} from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {CaUserCoreModule} from '../ca-core/entity-module/ca-user-core/ca-user-core.module';

/**
 * Main modules tha manage the pages once the user is connected
 */
@NgModule({
  declarations: [
    CaMainAppComponent,
    CaMySpacesPortalComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,

    CaCoreModule,
    CaSpaceCoreModule,
    CaUserCoreModule,

    // routing
    CaMainRoutingModule,
    CaCoreModule,
    CaNotificationsModule,
  ]
})
export class CaMainModule {
}
