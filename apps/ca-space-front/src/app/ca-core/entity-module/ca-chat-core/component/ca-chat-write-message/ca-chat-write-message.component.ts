import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { TeRichText } from '@monorepo/text-editor';
import { CaChatMessageTextEditorConfig } from '../../../../model/config/ca-chat-message-text-editor.config';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to write a message in a chat
 */
@Component({
  selector: 'ca-chat-write-message',
  templateUrl: './ca-chat-write-message.component.html',
  styleUrl: './ca-chat-write-message.component.scss',
  imports: [
    TeTextEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TranslatePipe,
  ],
})
export class CaChatWriteMessageComponent implements OnInit, OnDestroy {
  private folderService = inject(CaFolderService);

  @Input({ required: true }) folderId: string;

  @Input({ required: true }) mode: 'create' | 'update';

  @Input() messageContent: TeRichText;

  @Output() send = new EventEmitter<TeRichText>();
  @Output() cancelEdition = new EventEmitter<void>();

  textEditorConfig: CaChatMessageTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaChatMessageTextEditorConfig(this.folderId, this.folderService, this.mode);
  }

  enterEvent(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage(): void {
    // use a timeout to wait for the text editor to update the content
    // useful if send is called just after the text editor content is updated
    setTimeout(() => {
      if (this.messageContent && !this.messageContent.isEmpty()) {
        this.send.emit(this.messageContent);
        this.messageContent = null;
      }
    }, 500);
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
