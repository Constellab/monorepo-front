import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FlMouseButton, FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { ClHelpService } from '@monorepo/core-lib';

export interface CaHierarchyObjectTableEvent {
  action: 'click' | 'dblClick' | 'rightClick' | 'middleClick' | 'openChat' | 'openDescription';
  hierarchyObject: CaHierarchyObject;
}

@Component({
  selector: 'ca-hierarchy-object-table',
  templateUrl: './ca-hierarchy-object-table.component.html',
  styleUrl: './ca-hierarchy-object-table.component.scss'
})
export class CaHierarchyObjectTableComponent {
  @Input({ required: true }) datasource: CaHierarchyObjectDatasource;

  @Input() columns: FlTableColumnStatic<CaHierarchyObject>[] = ['name', 'user', 'lastModifiedAt'];

  // when true, the row become clickable and selectedFolderChange and folderDblClicked event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() selectedObject: CaHierarchyObject;

  @Output() rowEvent: EventEmitter<CaHierarchyObjectTableEvent> = new EventEmitter();

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  onFolderClick(folder: CaHierarchyObject, event: MouseEvent): void {
    if (this.rowSelectable) {
      this.selectedObject = folder;
      this.rowEvent.emit({
        action: event.button === FlMouseButton.LEFT ? 'click' : event.button === FlMouseButton.MIDDLE ? 'middleClick' : 'rightClick',
        hierarchyObject: folder
      });
    }
  }

  onFolderDblClick(object: CaHierarchyObject): void {
    if (this.rowSelectable) {
      this.rowEvent.emit({ action: 'dblClick', hierarchyObject: object });
    }
  }

  rightClick(object: CaHierarchyObject, event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'rightClick', hierarchyObject: object });
  }

  openChat(object: CaHierarchyObject, event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openChat', hierarchyObject: object });
  }

  openDescription(object: CaHierarchyObject, event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openDescription', hierarchyObject: object });
  }

  getViewContent(object: CaHierarchyObject): FlViewContext<CaHierarchyObject> {
    return { $implicit: object };
  }
}
