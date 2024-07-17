import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {TeConfig} from '../../model/te-config.class';
import {TeTextEditorHistoryService} from '../../model/te-text-editor-history.service';
import {
  TeTextEditorHistoryClickEventData
} from '../te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import {TeTextEditorHistoryUser} from '../../model/te-text-editor-history-user.class';
import {TeRichTextContent} from '../../model/te-rich-text.class';
import {
  TeTextEditorHistoryModification,
  TeTextEditorHistoryModificationGroup
} from '../../model/te-text-editor-history-modification.class';


export interface TeTextEditorHistoryModificationVisualizerDialogData {
  textEditorConfig: TeConfig;
  service: TeTextEditorHistoryService;
  entityId: string;
  clickEventData: TeTextEditorHistoryClickEventData;
  users: TeTextEditorHistoryUser[];
}



@Component({
  selector: 'te-text-editor-history-modification-visualizer-dialog',
  templateUrl: './te-text-editor-history-modification-visualizer-dialog.component.html',
  styleUrl: './te-text-editor-history-modification-visualizer-dialog.component.scss'
})
export class TeTextEditorHistoryModificationVisualizerDialogComponent implements OnInit {

  textEditorHistoryUsers: TeTextEditorHistoryUser[] = [];

  isGroup: boolean;
  textEditorConfig: TeConfig;
  service: TeTextEditorHistoryService;
  entityId: string;
  content: TeRichTextContent;
  group?: TeTextEditorHistoryModificationGroup;
  modification?: TeTextEditorHistoryModification;

  constructor(@Inject(MAT_DIALOG_DATA) dialogInput: TeTextEditorHistoryModificationVisualizerDialogData,
              private el: ElementRef,
              private renderer: Renderer2,
              private dialogService: FlDialogService) {
    this.isGroup = dialogInput.clickEventData.isGroup;
    this.textEditorConfig = dialogInput.textEditorConfig;
    this.service = dialogInput.service;
    this.entityId = dialogInput.entityId;
    this.group = dialogInput.clickEventData.group;
    this.modification = dialogInput.clickEventData.modification;
    this.textEditorHistoryUsers = dialogInput.users;
  }

  ngOnInit(): void {
    const modificationId = this.isGroup ? this.group.modifications[0].id : this.modification.id;

    this.service.getUndoContent(this.entityId, modificationId).subscribe(content => {
      this.content = content;
      this.highlightChanges()
    });
  }

  private highlightChanges(): void {
    if (this.isGroup) {
      for (const modification of this.group.modifications.slice().reverse()) {
        const textEditorUser = this.textEditorHistoryUsers.find(textEditorUser => textEditorUser.user.id === modification.userId);
        this.hollowElement(modification.blockId, textEditorUser.color);
      }
    } else {
      this.hollowElement(this.modification?.blockId, this.textEditorHistoryUsers[0].color);
    }
  }

  private hollowElement(blockId: string, color: string): void {
    const interval = setInterval(() => {
      const element = this.el.nativeElement.querySelector('.ce-block[data-id="' + blockId + '"]');
      if (element) {
        this.renderer.setStyle(element, 'background-color', color);
        this.renderer.setStyle(element, 'padding', '4px');
        this.renderer.setStyle(element, 'margin', '4px')
        clearInterval(interval);
      }
    }, 50);

  }

  openConfirmRollback(): void{
    const confirmDialogData: FlConfirmDialogInput =  {
      title: 'confirm_rollback_title',
      content: 'confirm_rollback_content',
      successMessage: 'confirm_rollback_success',
      translateMessage: true,
      translateTitleAndContent: true,
      observable: this.service.rollbackContent(this.entityId, this.isGroup ? this.group.modifications[0].id : this.modification.id)
    }

    this.dialogService.openConfirmDialog(confirmDialogData).afterClosed().subscribe((result: FlConfirmDialogResult) => {
      if(result.choice && result.result){
        window.location.reload();
      }
    })
  }
}
