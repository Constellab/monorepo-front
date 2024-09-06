import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FlMouseButton, FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib';
import { CaFolder, CaFolderDatasource } from '../../../../model/entities/project/ca-folder.class';
import { ClHelpService } from '@monorepo/core-lib';

export interface CaFolderTableEvent {
  action: 'click' | 'dblClick' | 'rightClick' | 'middleClick' | 'openChat' | 'openDescription';
  folder: CaFolder;
}

@Component({
  selector: 'ca-folder-table',
  templateUrl: './ca-folder-table.component.html',
  styleUrl: './ca-folder-table.component.scss'
})
export class CaFolderTableComponent {
  @Input({ required: true }) datasource: CaFolderDatasource;

  @Input() columns: FlTableColumnStatic<CaFolder>[] = ['name', 'user', 'lastModifiedAt'];

  // when true, the row become clickable and selectedFolderChange and folderDblClicked event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() selectedFolder: CaFolder;

  @Output() rowEvent: EventEmitter<CaFolderTableEvent> = new EventEmitter();

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  onFolderClick(folder: CaFolder, event: MouseEvent): void {
    if (this.rowSelectable) {
      this.selectedFolder = folder;
      this.rowEvent.emit({
        action: event.button === FlMouseButton.LEFT ? 'click' : event.button === FlMouseButton.MIDDLE ? 'middleClick' : 'rightClick',
        folder
      });
    }
  }

  onFolderDblClick(folder: CaFolder): void {
    if (this.rowSelectable) {
      this.rowEvent.emit({ action: 'dblClick', folder });
    }
  }

  rightClick(folder: CaFolder, event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'rightClick', folder });
  }

  openChat(folder: CaFolder, event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openChat', folder });
  }

  openDescription(folder: CaFolder, event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openDescription', folder });
  }

  getViewContent(folder: CaFolder): FlViewContext<CaFolder> {
    return { $implicit: folder };
  }
}
