import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  HaTextEditorHistoryModification,
  HaTextEditorHistoryModificationGroup
} from '../../model/ha-text-editor-history-modification.class';
import {HaUser} from '../../../../ha-model/ha-entities/ha-user';

export interface HaTextEditorHistoryClickEventData {
  isGroup: boolean;
  modification?: HaTextEditorHistoryModification;
  group?: HaTextEditorHistoryModificationGroup;
  users?: HaUser[];
}

@Component({
  selector: 'ha-text-editor-history-modification-group',
  templateUrl: './ha-text-editor-history-modification-group.component.html',
  styleUrl: './ha-text-editor-history-modification-group.component.scss'
})
export class HaTextEditorHistoryModificationGroupComponent implements OnInit {

  @Input({required: true}) group: HaTextEditorHistoryModificationGroup;

  @Output() openVisualizerWithData = new EventEmitter<HaTextEditorHistoryClickEventData>();

  users: HaUser[] = [];

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
    const eventData: HaTextEditorHistoryClickEventData = {
      isGroup: true,
      group: this.group,
      users: this.users
    }
    this.openVisualizerWithData.emit(eventData);
  }

  openModificationVisualizer(modification: HaTextEditorHistoryModification): void {
    const eventData: HaTextEditorHistoryClickEventData = {
      isGroup: false,
      modification: modification
    }
    this.openVisualizerWithData.emit(eventData);
  }
}
