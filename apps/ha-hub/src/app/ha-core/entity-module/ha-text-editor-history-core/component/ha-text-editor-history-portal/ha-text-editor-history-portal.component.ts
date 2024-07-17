import {Component, Inject, OnInit} from '@angular/core';
import {
  HaTextEditorHistoryModification,
  HaTextEditorHistoryModificationGroup
} from '../../model/ha-text-editor-history-modification.class';
import {TeConfig} from '@monorepo/text-editor';
import {FL_PORTAL_DATA, FlDialogService, FlOverlayRef} from '@monorepo/front-core-lib';
import {HaTextEditorHistoryService} from '../../model/ha-text-editor-history.service';
import {
  HaTextEditorHistoryClickEventData
} from '../ha-text-editor-history-modification-group/ha-text-editor-history-modification-group.component';
import {
  HaTextEditorHistoryModificationVisualizerDialogComponent,
  HaTextEditorHistoryModificationVisualizerDialogData
} from '../ha-text-editor-history-modification-visualizer-dialog/ha-text-editor-history-modification-visualizer-dialog.component';
import {HaTextEditorHistoryUser} from '../../model/ha-text-editor-history-user';


export interface HaTextEditorHistoryPortalData {
  entityId: string;
  service: HaTextEditorHistoryService;
  textEditorConfig: TeConfig;
}

@Component({
  selector: 'ha-text-editor-history-portal',
  templateUrl: './ha-text-editor-history-portal.component.html',
  styleUrl: './ha-text-editor-history-portal.component.scss'
})
export class HaTextEditorHistoryPortalComponent implements OnInit {

  textEditorConfig: TeConfig;
  entityId: string;
  service: HaTextEditorHistoryService;
  modifications: HaTextEditorHistoryModification[];
  modificationsGroups: HaTextEditorHistoryModificationGroup[] = [];
  users: HaTextEditorHistoryUser[] = [];

  private colors = ['rgba(255, 0, 0, 0.1)', 'rgba(0, 255, 0, 0.1)', 'rgba(0, 0, 255, 0.1)',
    'rgba(255, 255, 0, 0.1)', 'rgba(255, 0, 255, 0.1)', 'rgba(0, 255, 255, 0.1)'];

  constructor(@Inject(FL_PORTAL_DATA) data: HaTextEditorHistoryPortalData,
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

  openSingleModificationVisualizer(modification: HaTextEditorHistoryModification): void {
    const eventData: HaTextEditorHistoryClickEventData = {
      isGroup: false,
      modification: modification
    }
    this.openVisualizer(eventData);
  }

  openVisualizer(data: HaTextEditorHistoryClickEventData): void {

    const textEditorHistoryUsers: HaTextEditorHistoryUser[] = [];
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

    const dialogData: HaTextEditorHistoryModificationVisualizerDialogData = {
      clickEventData: data,
      textEditorConfig: this.textEditorConfig,
      service: this.service,
      entityId: this.entityId,
      users: textEditorHistoryUsers
    };

    this.dialogService.openMediumDialog(HaTextEditorHistoryModificationVisualizerDialogComponent, {data: dialogData})
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
      if (this.modificationsGroups.length == 0) {
        this.modificationsGroups.push({
          start: modification.time,
          end: modification.time,
          modifications: [modification]
        });
        continue;
      }
      if (this.modificationsGroups[this.modificationsGroups.length - 1].end - 10 * 60 * 1000 < modification.time) {
        this.modificationsGroups[this.modificationsGroups.length - 1].modifications.push(modification);
      } else {
        this.modificationsGroups.push({
          start: modification.time,
          end: modification.time,
          modifications: [modification]
        });
      }
    }
  }
}
