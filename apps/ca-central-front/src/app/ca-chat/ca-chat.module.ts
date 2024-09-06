import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../ca-core/ca-core.module';
import { RouterModule } from '@angular/router';
import { CaChatRoutingModule } from './ca-chat-routing.module';
import { CaChatFolderTreeComponent } from './component/ca-chat-folder-tree/ca-chat-folder-tree.component';
import { CaChatPageComponent } from './component/ca-chat-page/ca-chat-page.component';
import { CaChatDetailPageComponent } from './component/ca-chat-detail-page/ca-chat-detail-page.component';
import { CaChatCoreModule } from '../ca-core/entity-module/ca-chat-core/ca-chat-core.module';
import { CaFolderCoreModule } from '../ca-core/entity-module/ca-folder-core/ca-folder-core.module';
import { CaNotificationCoreModule } from '../ca-core/entity-module/ca-notification-core/ca-notification-core.module';

/**
 * Module for the dashboard page
 */
@NgModule({
  declarations: [
    CaChatPageComponent,
    CaChatDetailPageComponent,
    CaChatFolderTreeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaChatCoreModule,
    CaFolderCoreModule,
    CaNotificationCoreModule,

    CaChatRoutingModule
  ]
})
export class CaChatModule {
}
