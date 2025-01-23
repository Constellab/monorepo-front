import { Component, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlConfirmDialogInput } from '@monorepo/front-core-lib/fl-dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeConfig } from '../../model/te-config.class';
import { TeTextEditorHistoryService } from '../../model/te-text-editor-history.service';
import { TeTextEditorHistoryClickEventData } from '../te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import { TeTextEditorHistoryUser } from '../../model/te-text-editor-history-user.class';
import { TeHelper } from '../../model/te.helper';
import { TeEvent } from '../../model/te-event.class';
import { TeTextEditorHistoryModificationGroup } from '../../model/te-modifications-group.class';
import { TeRichText } from '../../model/lib';

export interface TeTextEditorHistoryModificationVisualizerDialogData {
  textEditorConfig: TeConfig;
  service: TeTextEditorHistoryService;
  entityId: string;
  clickEventData: TeTextEditorHistoryClickEventData;
  users: TeTextEditorHistoryUser[];
  isEditable: boolean;
}

@Component({
  selector: 'te-text-editor-history-modification-visualizer-dialog',
  templateUrl: './te-text-editor-history-modification-visualizer-dialog.component.html',
  styleUrl: './te-text-editor-history-modification-visualizer-dialog.component.scss',
  standalone: false,
})
export class TeTextEditorHistoryModificationVisualizerDialogComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private dialogService = inject(FlDialogService);

  textEditorEvent: TeEvent;
  group: TeTextEditorHistoryModificationGroup;

  textEditorHistoryUsers: TeTextEditorHistoryUser[] = [];
  textEditorConfig: TeConfig;
  private service: TeTextEditorHistoryService;
  richText: TeRichText;
  private entityId: string;
  isLoading = true;
  isEditable = true;

  constructor() {
    const dialogInput = inject<TeTextEditorHistoryModificationVisualizerDialogData>(MAT_DIALOG_DATA);

    this.textEditorConfig = dialogInput.textEditorConfig;
    this.service = dialogInput.service;
    this.entityId = dialogInput.entityId;
    this.group = dialogInput.clickEventData.group;
    this.textEditorHistoryUsers = dialogInput.users;
    this.isEditable = dialogInput.isEditable;
  }

  ngOnInit(): void {
    const modificationId = this.group.mainModificationId();
    this.textEditorEvent = new TeEvent();
    this.service.getPreviousVersion(this.entityId, modificationId).subscribe((content) => {
      this.richText = new TeRichText(content);
      this.highlightChanges();
    });
  }

  ngOnDestroy(): void {
    this.textEditorEvent.destroy();
  }

  private highlightChanges(): void {
    for (const modification of this.group.modifications.slice().reverse()) {
      const textEditorUser = this.textEditorHistoryUsers.find(
        (textEditorUser) => textEditorUser.user.id === modification.userId
      );
      this.hollowElement(modification.blockId, textEditorUser.color);
    }
    this.isLoading = false;
  }

  openConfirmRollback(): void {
    const confirmDialogData: FlConfirmDialogInput = {
      title: 'teTextEditor.confirm_rollback_title',
      content: 'teTextEditor.confirm_rollback_content',
      successMessage: 'teTextEditor.confirm_rollback_success',
      observable: this.service.rollbackContent(this.entityId, this.group.mainModificationId()),
    };

    this.dialogService
      .openConfirmDialog(confirmDialogData)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        if (result.choice && result.result) {
          window.location.reload();
        }
      });
  }

  private hollowElement(blockId: string, color: string): void {
    this.textEditorEvent.isTextEditorHTMLInit$().subscribe((isInit) => {
      if (isInit) {
        TeHelper.hollowElement(blockId, color, this.el.nativeElement);
      }
    });
  }
}
