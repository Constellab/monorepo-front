import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlUser} from '@monorepo/front-core-lib';
import {
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryModificationGroup
} from '../../model/te-text-editor-history-modification.class';

export interface TeTextEditorHistoryClickEventData {
  group: TeTextEditorHistoryModificationGroup;
  users: FlUser[];
}

@Component({
  selector: 'te-text-editor-history-modification-group',
  templateUrl: './te-text-editor-history-modification-group.component.html',
  styleUrl: './te-text-editor-history-modification-group.component.scss'
})
export class TeTextEditorHistoryModificationGroupComponent implements OnInit {

  @Input({required: true}) group: TeTextEditorHistoryModificationGroup;

  @Output() openVisualizerWithData = new EventEmitter<TeTextEditorHistoryClickEventData>();

  users: FlUser[] = [];

  groupOpened: boolean = false;

  ngOnInit(): void {
    for (const modification of this.group.modifications) {
      if (!this.users.find(user => user.id === modification.userId)) {
        this.users.push(modification.user);
      }
    }
  }

  toggleGroup(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.groupOpened = !this.groupOpened;
  }

  openGroupModificationVisualizer(): void {
    const eventData: TeTextEditorHistoryClickEventData = {
      group: this.group,
      users: this.users
    }
    this.openVisualizerWithData.emit(eventData);
  }

  openModificationVisualizer(modification: TeTextEditorHistoryBlockModification): void {
    const group = new TeTextEditorHistoryModificationGroup(modification.time);
    group.modifications = [modification];
    const eventData: TeTextEditorHistoryClickEventData = {
      group: group,
      users: [modification.user]
    }
    this.openVisualizerWithData.emit(eventData);
  }
}
