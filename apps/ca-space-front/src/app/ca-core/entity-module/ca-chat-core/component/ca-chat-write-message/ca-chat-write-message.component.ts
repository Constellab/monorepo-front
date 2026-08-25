import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { CaChatMessageTextEditorConfig } from '../../../../model/config/ca-chat-message-text-editor.config';
import { CaChatService } from '../../../../service-api/ca-chat.service';
import { CaFolderService } from '../../../../service-api/ca-folder.service';

/**
 * Component to write a message in a chat
 */
@Component({
  selector: 'ca-chat-write-message',
  templateUrl: './ca-chat-write-message.component.html',
  styleUrl: './ca-chat-write-message.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    TeTextEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TranslatePipe,
  ],
  host: { class: 'g-card' },
})
export class CaChatWriteMessageComponent implements OnInit, OnDestroy {
  private folderService = inject(CaFolderService);
  private chatService = inject(CaChatService);

  @Input({ required: true }) folderId: string;

  @Input({ required: true }) mode: 'create' | 'update';

  @Input() messageContent: TeRichText | null;

  @Output() send = new EventEmitter<TeRichText>();
  @Output() cancelEdition = new EventEmitter<void>();

  textEditorConfig: CaChatMessageTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaChatMessageTextEditorConfig(
      this.folderId,
      this.chatService,
      this.folderService,
      this.mode
    );
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
