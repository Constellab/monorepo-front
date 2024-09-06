import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import { CaChatFolderComponent } from './component/ca-chat-folder/ca-chat-folder.component';
import { CaChatMessageComponent } from './component/ca-chat-message/ca-chat-message.component';
import { CaChatWriteMessageComponent } from './component/ca-chat-write-message/ca-chat-write-message.component';
import { CaNotificationCoreModule } from '../ca-notification-core/ca-notification-core.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CaChatFolderComponent,
    CaChatMessageComponent,
    CaChatWriteMessageComponent,
  ],
  exports: [
    CaChatFolderComponent,
    CaChatMessageComponent,
    CaChatWriteMessageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    CaCoreModule,
    CaNotificationCoreModule,
  ]
})
export class CaChatCoreModule {
}
