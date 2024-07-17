import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlUserDto} from '@monorepo/front-core-lib';
import {
  TeTextEditorHistoryModification,
  TeTextEditorHistoryModificationGroup
} from '../../model/te-text-editor-history-modification.class';

export interface TeTextEditorHistoryClickEventData {
  isGroup: boolean;
  modification?: TeTextEditorHistoryModification;
  group?: TeTextEditorHistoryModificationGroup;
  users?: FlUserDto[];
}

@Component({
  selector: 'te-text-editor-history-modification-group',
  templateUrl: './te-text-editor-history-modification-group.component.html',
  styleUrl: './te-text-editor-history-modification-group.component.scss'
})
export class TeTextEditorHistoryModificationGroupComponent implements OnInit {

  @Input({required: true}) group: TeTextEditorHistoryModificationGroup;

  @Output() openVisualizerWithData = new EventEmitter<TeTextEditorHistoryClickEventData>();

  users: FlUserDto[] = [];

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
      isGroup: true,
      group: this.group,
      users: this.users
    }
    this.openVisualizerWithData.emit(eventData);
  }

  openModificationVisualizer(modification: TeTextEditorHistoryModification): void {
    const eventData: TeTextEditorHistoryClickEventData = {
      isGroup: false,
      modification: modification
    }
    this.openVisualizerWithData.emit(eventData);
  }
}
