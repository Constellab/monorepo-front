import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ClHelpService } from '@monorepo/core-lib';
import { FlMarkdownModule } from '@monorepo/front-core-lib/fl-markdown';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { LiOpenAiChatMessage, LiOpenAiChatMessageRole } from '../../model/li-open-ai.class';

export type LiOpenAiChatMessageAction = 'delete' | 'delete-all';

@Component({
  selector: 'li-open-ai-chat-message',
  templateUrl: './li-open-ai-chat-message.component.html',
  styleUrls: ['./li-open-ai-chat-message.component.scss'],
  imports: [
    NgClass,
    MatIcon,
    FlTextIconModule,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    TranslatePipe,
    FlMarkdownModule,
  ],
})
export class LiOpenAiChatMessageComponent implements OnInit {
  @Input() message: LiOpenAiChatMessage;

  @Output() action: EventEmitter<LiOpenAiChatMessageAction> = new EventEmitter();

  mode: 'read' | 'edit' = 'read';
  editContent: string;
  editRowCount: number = 1;

  showContent: boolean;

  ngOnInit(): void {
    this.showContent = this.message?.role !== 'system';
  }

  get role(): LiOpenAiChatMessageRole {
    return this.message?.role ?? null;
  }

  get icon(): string {
    switch (this.role) {
      case 'user':
        return 'person';
      case 'assistant':
        return 'smart_toy';
      case 'system':
        return 'settings_suggest';
      default:
        return 'android';
    }
  }

  onAction(action: LiOpenAiChatMessageAction): void {
    this.action.emit(action);
  }

  toggleContent(): void {
    this.showContent = !this.showContent;
  }

  setEditMode(): void {
    this.mode = 'edit';
    this.editContent = this.message.content;
    if (this.editContent) {
      this.editRowCount = Math.max(this.editContent.split('\n').length, 4);
    }
  }

  escapePressed(event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.mode = 'read';
  }

  saveEdit(): void {
    this.message.content = this.editContent;
    this.mode = 'read';
  }
}
