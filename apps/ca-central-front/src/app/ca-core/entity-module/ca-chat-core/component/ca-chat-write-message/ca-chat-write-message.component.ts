import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TeRichText } from '@monorepo/text-editor';
import { CaChatMessageTextEditorConfig } from '../../../../model/config/ca-chat-message-text-editor.config';
import { CaFolderService } from '../../../../service-api/ca-folder.service';

/**
 * Component to write a message in a chat
 */
@Component({
  selector: 'ca-chat-write-message',
  templateUrl: './ca-chat-write-message.component.html',
  styleUrl: './ca-chat-write-message.component.scss',
})
export class CaChatWriteMessageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) folderId: string;

  @Input({ required: true }) mode: 'create' | 'update';

  @Input() messageContent: TeRichText;

  @Output() send = new EventEmitter<TeRichText>();
  @Output() cancelEdition = new EventEmitter<void>();

  textEditorConfig: CaChatMessageTextEditorConfig;

  constructor(private folderService: CaFolderService) {}

  ngOnInit(): void {
    this.textEditorConfig = new CaChatMessageTextEditorConfig(this.folderId, this.folderService, this.mode);
  }

  enterEvent(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.messageContent.isEmpty()) {
      this.send.emit(this.messageContent);
      this.messageContent = null;
    }
  }

  cancelEdit(): void {
    this.cancelEdition.emit();
  }

  addFigureBlock(): void {
    this.textEditorConfig.addFigureBlock();
  }

  ngOnDestroy(): void {
    this.textEditorConfig?.event.destroy();
  }
}
