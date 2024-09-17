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
  event: MouseEvent;
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
        hierarchyObject: folder,
        event: event
      });
    }
  }

  onFolderDblClick(object: CaHierarchyObject, event: MouseEvent): void {
    if (this.rowSelectable) {
      this.rowEvent.emit({ action: 'dblClick', hierarchyObject: object, event: event });
    }
  }

  rightClick(object: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'rightClick', hierarchyObject: object, event: event });
  }

  openChat(object: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openChat', hierarchyObject: object, event: event });
  }

  openDescription(object: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openDescription', hierarchyObject: object, event: event });
  }

  getViewContent(object: CaHierarchyObject): FlViewContext<CaHierarchyObject> {
    return { $implicit: object };
  }
}
