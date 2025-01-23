import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabOpenAiChatMessage, LabOpenAiChatMessageRole } from '../../model/lab-open-ai.class';
import { ClHelpService } from '@monorepo/core-lib';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

export type LabOpenAiChatMessageAction = 'delete' | 'delete-all';

@Component({
  selector: 'lab-open-ai-chat-message',
  templateUrl: './lab-open-ai-chat-message.component.html',
  styleUrls: ['./lab-open-ai-chat-message.component.scss'],
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
    TdTechnicalDocModule,
  ],
})
export class LabOpenAiChatMessageComponent implements OnInit {
  @Input() message: LabOpenAiChatMessage;

  @Output() action: EventEmitter<LabOpenAiChatMessageAction> = new EventEmitter();

  mode: 'read' | 'edit' = 'read';
  editContent: string;
  editRowCount: number = 1;

  showContent: boolean;

  ngOnInit(): void {
    this.showContent = this.message?.role !== 'system';
  }

  get role(): LabOpenAiChatMessageRole {
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

  onAction(action: LabOpenAiChatMessageAction): void {
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
