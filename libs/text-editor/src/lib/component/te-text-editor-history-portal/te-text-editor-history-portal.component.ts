import { Component, Inject, OnInit } from '@angular/core';
import { FL_PORTAL_DATA, FlColorHelper, FlDialogService } from '@monorepo/front-core-lib';
import { TeTextEditorHistoryService } from '../../model/te-text-editor-history.service';
import { TeConfig } from '../../model/te-config.class';
import {
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryModificationGroup,
} from '../../model/te-text-editor-history-modification.class';
import { TeTextEditorHistoryUser } from '../../model/te-text-editor-history-user.class';
import { TeTextEditorHistoryClickEventData } from '../te-text-editor-history-modification-group/te-text-editor-history-modification-group.component';
import {
  TeTextEditorHistoryModificationVisualizerDialogComponent,
  TeTextEditorHistoryModificationVisualizerDialogData,
} from '../te-text-editor-history-modification-visualizer-dialog/te-text-editor-history-modification-visualizer-dialog.component';
import { DateTime, Duration } from 'luxon';

export interface TeTextEditorHistoryPortalData {
  entityId: string;
  service: TeTextEditorHistoryService;
  textEditorConfig: TeConfig;
  isEditable: boolean;
}

const GROUP_TIME_INTERVAL = Duration.fromObject({ minutes: 10 });

@Component({
  selector: 'te-text-editor-history-portal',
  templateUrl: './te-text-editor-history-portal.component.html',
  styleUrl: './te-text-editor-history-portal.component.scss',
})
export class TeTextEditorHistoryPortalComponent implements OnInit {
  isLoading = true;

  modificationsGroups: TeTextEditorHistoryModificationGroup[] = [];
  private users: TeTextEditorHistoryUser[] = [];

  private colors = FlColorHelper.getColorList(0.2);

  constructor(
    @Inject(FL_PORTAL_DATA) private data: TeTextEditorHistoryPortalData,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    this.data.service.getHistory(this.data.entityId).subscribe((modifications) => {
      modifications.map((modification) => {
        modification.time = DateTime.fromISO(modification.time as string);
      });
      this.pushUsers(modifications);
      this.createGroups(modifications);
      this.isLoading = false;
    });
  }

  openSingleModificationVisualizer(modification: TeTextEditorHistoryBlockModification): void {
    const group = new TeTextEditorHistoryModificationGroup(modification.time as DateTime);
    group.modifications = [modification];
    const eventData: TeTextEditorHistoryClickEventData = {
      group: group,
      users: [modification.user],
    };
    this.openVisualizer(eventData);
  }

  openVisualizer(data: TeTextEditorHistoryClickEventData): void {
    const textEditorHistoryUsers: TeTextEditorHistoryUser[] = [];

    for (const modification of data.group.modifications) {
      const user = this.findUserById(modification.userId);
      if (
        user &&
        !textEditorHistoryUsers.find((textEditorUser) => textEditorUser.user.id === modification.userId)
      ) {
        textEditorHistoryUsers.push(user);
      }
    }

    const dialogData: TeTextEditorHistoryModificationVisualizerDialogData = {
      clickEventData: data,
      textEditorConfig: this.data.textEditorConfig,
      service: this.data.service,
      entityId: this.data.entityId,
      users: textEditorHistoryUsers,
      isEditable: this.data.isEditable,
    };

    this.dialogService
      .openMediumDialog(TeTextEditorHistoryModificationVisualizerDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(() => {});
  }

  private pushUsers(modifications: TeTextEditorHistoryBlockModification[]): void {
    for (const modification of modifications) {
      if (!this.findUserById(modification.userId)) {
        this.users.push({
          color: this.colors[this.users.length % this.colors.length],
          user: modification.user,
        });
      }
    }
  }

  private createGroups(modifications: TeTextEditorHistoryBlockModification[]): void {
    for (const modification of modifications.reverse()) {
      if (
        this.modificationsGroups.length != 0 &&
        this.modificationsGroups[this.modificationsGroups.length - 1]?.end.minus(GROUP_TIME_INTERVAL) <
          modification.time
      ) {
        this.modificationsGroups[this.modificationsGroups.length - 1].modifications.push(modification);
      } else {
        const group: TeTextEditorHistoryModificationGroup = new TeTextEditorHistoryModificationGroup(
          modification.time as DateTime
        );
        group.modifications = [modification];
        this.modificationsGroups.push(group);
      }
    }
  }

  private findUserById(userId: string): TeTextEditorHistoryUser {
    return this.users.find((user) => user.user.id === userId);
  }
}
