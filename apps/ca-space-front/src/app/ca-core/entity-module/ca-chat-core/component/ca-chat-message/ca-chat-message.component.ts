import { Component, computed, EventEmitter, inject, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { CaChatMessageTextEditorConfig } from '../../../../model/config/ca-chat-message-text-editor.config';
import { CaChatMessage } from '../../../../model/entities/ca-chat-message';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { CaChatService } from '../../../../service-api/ca-chat.service';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaNotificationMarkDirective } from '../../../ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { CaChatWriteMessageComponent } from '../ca-chat-write-message/ca-chat-write-message.component';

/**
 * Component to show a message in a chat
 */
@Component({
  selector: 'ca-chat-message',
  templateUrl: './ca-chat-message.component.html',
  styleUrl: './ca-chat-message.component.scss',
  imports: [
    CaNotificationMarkDirective,
    FlUserModule,
    FlDateModule,
    CaChatWriteMessageComponent,
    TeTextEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TranslatePipe,
  ],
})
export class CaChatMessageComponent implements OnInit, OnDestroy {
  private folderService = inject(CaFolderService);
  private authUserService = inject(CaAuthenticatedUserService);
  private dialogService = inject(FlDialogService);
  private chatService = inject(CaChatService);

  message = input.required<CaChatMessage>();
  folderId = input.required<string>();

  @Output() messageUpdated = new EventEmitter<CaChatMessage>();
  @Output() messageDeleted = new EventEmitter<CaChatMessage>();

  showButtons = computed(
    () =>
      this.authUserService.getCurrentUser().id === this.message().createdBy.id &&
      Math.abs(this.message().createdAt.diffNow('minute').as('minute')) < 5
  );

  editMode: boolean = false;

  textEditorConfig: CaChatMessageTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaChatMessageTextEditorConfig(
      this.folderId(),
      this.chatService,
      this.folderService
    );
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

  updateMessage(content: TeRichText): void {
    this.chatService
      .updateMessage(this.folderId(), this.message().id, content)
      .subscribe((message: CaChatMessage) => this.updateMessageSuccess(message));
  }

  private updateMessageSuccess(message: CaChatMessage): void {
    this.disableEditMode();
    this.messageUpdated.emit(message);
  }

  deleteMessage(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_message',
      content: 'delete_message_confirmation',
      observable: this.chatService.deleteMessage(this.folderId(), this.message().id),
      successMessage: 'delete_message_success',
    };
    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => this.deleteMessageClosed(res));
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
