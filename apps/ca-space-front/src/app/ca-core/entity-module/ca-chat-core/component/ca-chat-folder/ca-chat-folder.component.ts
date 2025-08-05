import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, OnDestroy, Signal } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { TeRichText } from '@monorepo/text-editor';

import { CaChatMessage, CaChatMessageDatasourcePaginated } from '../../../../model/entities/ca-chat-message';
import { CaChatService } from '../../../../service-api/ca-chat.service';
import { CaChatMessageComponent } from '../ca-chat-message/ca-chat-message.component';
import { CaChatWriteMessageComponent } from '../ca-chat-write-message/ca-chat-write-message.component';

/**
 * Component to load message of a chat of a folder and show them.
 * The user can add a new message to the chat
 */
@Component({
  selector: 'ca-chat-folder',
  templateUrl: './ca-chat-folder.component.html',
  styleUrl: './ca-chat-folder.component.scss',
  imports: [
    FlInfiniteScrollModule,
    CaChatMessageComponent,
    FlCoreDirectiveModule,
    CaChatWriteMessageComponent,
    AsyncPipe,
    FlCorePipeModule,
  ],
})
export class CaChatFolderComponent implements OnDestroy {
  private chatService = inject(CaChatService);

  folderId = input.required<string>();

  messages: Signal<CaChatMessageDatasourcePaginated> = computed(
    () =>
      new FlEntityPaginatedDatasource(
        (page, size) => this.chatService.getFolderMessages(this.folderId(), page, size),
        15
      )
  );

  createNewMessage(content: TeRichText): void {
    this.chatService
      .createMessage(this.folderId(), content)
      .subscribe((message) => this.createSuccess(message));
  }

  private createSuccess(message: CaChatMessage): void {
    this.messages().addItem(message, () => true);
  }

  messageUpdated(message: CaChatMessage): void {
    this.messages().updateItem(message);
  }

  messageDeleted(message: CaChatMessage): void {
    this.messages().removeItem(message);
  }

  ngOnDestroy(): void {
    this.messages()?.disconnect();
  }
}
