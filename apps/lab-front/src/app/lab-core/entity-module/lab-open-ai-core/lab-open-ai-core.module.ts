import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabOpenAiChatComponent } from './component/lab-open-ai-chat/lab-open-ai-chat.component';
import { LabOpenAiChatMessageComponent } from './component/lab-open-ai-chat-message/lab-open-ai-chat-message.component';
import { LabOpenAiChatDynamicFieldComponent } from './component/lab-open-ai-chat-dynamic-field/lab-open-ai-chat-dynamic-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabCoreModule } from '../../lab-core.module';
import { LabOpenAiMessageContentPipe } from './pipe/lab-open-ai-message-content.pipe';

@NgModule({
  declarations: [
    LabOpenAiChatComponent,
    LabOpenAiChatMessageComponent,
    LabOpenAiChatDynamicFieldComponent,
    LabOpenAiMessageContentPipe,
  ],
  exports: [LabOpenAiChatComponent, LabOpenAiChatMessageComponent, LabOpenAiChatDynamicFieldComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LabCoreModule],
})
export class LabOpenAiCoreModule {}
