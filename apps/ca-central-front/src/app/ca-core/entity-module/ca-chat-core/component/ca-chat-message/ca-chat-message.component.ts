import { Component, computed, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
import { CaChatMessage } from '../../../../model/entities/ca-chat-message';
import { CaChatMessageTextEditorConfig } from '../../../../model/config/ca-chat-message-text-editor.config';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { TeRichTextContent } from '@monorepo/text-editor';

/**
 * Component to show a message in a chat
 */
@Component({
  selector: 'ca-chat-message',
  templateUrl: './ca-chat-message.component.html',
  styleUrl: './ca-chat-message.component.scss'
})
export class CaChatMessageComponent implements OnInit, OnDestroy {

  message = input.required<CaChatMessage>();
  folderId = input.required<string>();

  @Output() messageUpdated = new EventEmitter<CaChatMessage>();
  @Output() messageDeleted = new EventEmitter<CaChatMessage>();

  showButtons = computed(() => this.authUserService.getCurrentUser().id === this.message().createdBy.id &&
    this.message().createdAt.diffNow('minute').as('minute') > -5);

  editMode: boolean = false;

  textEditorConfig: CaChatMessageTextEditorConfig;

  constructor(private folderService: CaFolderService,
              private authUserService: CaAuthenticatedUserService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaChatMessageTextEditorConfig(this.folderId(), this.folderService);
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

  updateMessage(content: TeRichTextContent): void {
    this.folderService.updateMessage(this.folderId(), this.message().id,
      content).subscribe((message: CaChatMessage) =>
      this.updateMessageSuccess(message)
    );
  }

  private updateMessageSuccess(message: CaChatMessage): void {
    this.disableEditMode();
    this.messageUpdated.emit(message);
  }

  deleteMessage(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_message',
      content: 'delete_message_confirmation',
      translateTitleAndContent: true,
      observable: this.folderService.deleteMessage(this.folderId(),
        this.message().id),
      successMessage: 'delete_message_success',
      translateMessage: true
    };
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      (res) => this.deleteMessageClosed(res)
    );
  }

  private deleteMessageClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.messageDeleted.emit(this.message());
    }
  }

  ngOnDestroy(): void {
    this.textEditorConfig?.event.destroy();
  }
}
