import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../ca-core/ca-core.module';
import { RouterModule } from '@angular/router';
import { CaChatRoutingModule } from './ca-chat-routing.module';
import { CaChatPageComponent } from './component/ca-chat-page/ca-chat-page.component';
import { CaChatDetailPageComponent } from './component/ca-chat-detail-page/ca-chat-detail-page.component';
import { CaChatCoreModule } from '../ca-core/entity-module/ca-chat-core/ca-chat-core.module';
import {
  CaHierarchyObjectCoreModule
} from '../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';
import { CaNotificationCoreModule } from '../ca-core/entity-module/ca-notification-core/ca-notification-core.module';
import { CaUserCoreModule } from '../ca-core/entity-module/ca-user-core/ca-user-core.module';

/**
 * Module for the dashboard page
 */
@NgModule({
  declarations: [
    CaChatPageComponent,
    CaChatDetailPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaChatCoreModule,
    CaHierarchyObjectCoreModule,
    CaNotificationCoreModule,

    CaChatRoutingModule,
    CaUserCoreModule
  ]
})
export class CaChatModule {
}
