import { Component, computed, input, OnDestroy, Signal } from '@angular/core';
import { CaChatMessage, CaChatMessageDatasourcePaginated } from '../../../../model/entities/ca-chat-message';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { TeRichTextContent } from '@monorepo/text-editor';

/**
 * Component to load message of a chat of a folder and show them.
 * The user can add a new message to the chat
 */
@Component({
  selector: 'ca-chat-folder',
  templateUrl: './ca-chat-folder.component.html',
  styleUrl: './ca-chat-folder.component.scss'
})
export class CaChatFolderComponent implements OnDestroy {

  folderId = input.required<string>();

  messages: Signal<CaChatMessageDatasourcePaginated> = computed(() => this.folderService.getFolderMessagesDatasource(this.folderId()));

  constructor(private folderService: CaFolderService) {
  }

  createNewMessage(content: TeRichTextContent): void {
    this.folderService.createMessage(this.folderId(), content).subscribe(
      message => this.createSuccess(message)
    );
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
