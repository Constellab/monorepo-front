import { Component, computed, EventEmitter, inject, input, OnDestroy, OnInit, Output } from '@angular/core';
import { CaChatMessage } from '../../../../model/entities/ca-chat-message';
import { CaChatMessageTextEditorConfig } from '../../../../model/config/ca-chat-message-text-editor.config';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { TeRichText } from '@monorepo/text-editor';
import {
  CaNotificationMarkDirective,
} from '../../../ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { CaChatWriteMessageComponent } from '../ca-chat-write-message/ca-chat-write-message.component';
import {
  TeTextEditorModule,
} from '../../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

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

  message = input.required<CaChatMessage>();
  folderId = input.required<string>();

  @Output() messageUpdated = new EventEmitter<CaChatMessage>();
  @Output() messageDeleted = new EventEmitter<CaChatMessage>();

  showButtons = computed(
    () =>
      this.authUserService.getCurrentUser().id === this.message().createdBy.id &&
      this.message().createdAt.diffNow('minute').as('minute') > 5
  );

  editMode: boolean = false;

  textEditorConfig: CaChatMessageTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaChatMessageTextEditorConfig(this.folderId(), this.folderService);
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

  updateMessage(content: TeRichText): void {
    this.folderService
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
      observable: this.folderService.deleteMessage(this.folderId(), this.message().id),
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
