import {Component, Inject, OnInit} from '@angular/core';
import {FL_PORTAL_DATA, FlDialogService, FlOverlayRef} from '@monorepo/front-core-lib';
import {TeTextEditorHistoryService} from '../../model/te-text-editor-history.service';
import {TeConfig} from '../../model/te-config.class';
import {
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryModificationGroup
} from '../../model/te-text-editor-history-modification.class';
import {TeTextEditorHistoryUser} from '../../model/te-text-editor-history-user.class';
import {
  TeTextEditorHistoryClickEventData
} from '../te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import {
  TeTextEditorHistoryModificationVisualizerDialogComponent,
  TeTextEditorHistoryModificationVisualizerDialogData
} from '../te-text-editor-history-modification-visualizer-dialog/te-text-editor-history-modification-visualizer-dialog.component';



export interface TeTextEditorHistoryPortalData {
  entityId: string;
  service: TeTextEditorHistoryService;
  textEditorConfig: TeConfig;
}

@Component({
  selector: 'te-text-editor-history-portal',
  templateUrl: './te-text-editor-history-portal.component.html',
  styleUrl: './te-text-editor-history-portal.component.scss'
})
export class TeTextEditorHistoryPortalComponent implements OnInit {

  textEditorConfig: TeConfig;
  entityId: string;
  service: TeTextEditorHistoryService;
  modifications: TeTextEditorHistoryBlockModification[];
  modificationsGroups: TeTextEditorHistoryModificationGroup[] = [];
  users: TeTextEditorHistoryUser[] = [];

  private colors = ['rgba(255, 0, 0, 0.1)', 'rgba(0, 255, 0, 0.1)', 'rgba(0, 0, 255, 0.1)',
    'rgba(255, 255, 0, 0.1)', 'rgba(255, 0, 255, 0.1)', 'rgba(0, 255, 255, 0.1)'];

  constructor(@Inject(FL_PORTAL_DATA) data: TeTextEditorHistoryPortalData,
              private overlayRef: FlOverlayRef,
              private dialogService: FlDialogService) {
    this.textEditorConfig = data.textEditorConfig;
    this.entityId = data.entityId;
    this.service = data.service;
  }

  ngOnInit(): void {
    this.service.getHistory(this.entityId).subscribe(modifications => {
      this.modifications = modifications;
      this.pushUsers();
      this.createGroups();
    });
  }

  openSingleModificationVisualizer(modification: TeTextEditorHistoryBlockModification): void {
    const eventData: TeTextEditorHistoryClickEventData = {
      isGroup: false,
      modification: modification
    }
    this.openVisualizer(eventData);
  }

  openVisualizer(data: TeTextEditorHistoryClickEventData): void {

    const textEditorHistoryUsers: TeTextEditorHistoryUser[] = [];
    if (data.isGroup) {
      for (const modification of data.group.modifications) {
        const user = this.users.find(user => user.user.id === modification.userId);
        if (user && !textEditorHistoryUsers.find(textEditorUser => textEditorUser.user.id === modification.userId)) {
          textEditorHistoryUsers.push(user);
        }
      }
    } else {
      textEditorHistoryUsers.push(this.users.find(user => user.user.id === data.modification.userId));
    }

    const dialogData: TeTextEditorHistoryModificationVisualizerDialogData = {
      clickEventData: data,
      textEditorConfig: this.textEditorConfig,
      service: this.service,
      entityId: this.entityId,
      users: textEditorHistoryUsers
    };

    this.dialogService.openMediumDialog(TeTextEditorHistoryModificationVisualizerDialogComponent, {data: dialogData})
      .afterClosed().subscribe(() => {
        console.log('dialog closed')
    });
  }

  closePortal(): void {
    this.overlayRef.dispose();
  }

  private pushUsers(): void {
    for (const modification of this.modifications) {
      if (!this.users.find(user => user.user.id === modification.userId)) {
        this.users.push({
          color: this.colors[this.users.length % this.colors.length],
          user: modification.user
        });
      }
    }
  }

  private createGroups(): void {
    for (const modification of this.modifications.reverse()) {
      if (this.modificationsGroups.length != 0 &&
        this.modificationsGroups[this.modificationsGroups.length - 1]?.end - 10 * 60 * 1000 < modification.time) {

        this.modificationsGroups[this.modificationsGroups.length - 1].modifications.push(modification);
      } else {
        const group: TeTextEditorHistoryModificationGroup = new TeTextEditorHistoryModificationGroup()
        group.start = modification.time;
        group.end = modification.time;
        group.modifications = [modification];
        this.modificationsGroups.push(group);
      }
    }
  }
}
