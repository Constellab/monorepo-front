import { CaHierarchyObjectActionEvent } from '../../ca-folder-detail-page/ca-hierarchy-object-action-menu';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CaFolder } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderActionEvent } from '../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { CaDocumentActionEvent } from '../../ca-document-core/ca-document-action-menu';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaResourceActionEvent } from '../../ca-resource-detail-page/ca-resource-action-menu';
import { CaNoteActionEvent } from '../../ca-note-core/ca-note-action-menu';

export type CaHierarchyObjectEvent =
  | {
      action: 'create';
      hierarchyObjectId: string;
      hierarchyObjectType: CaHierarchyObjectType;
      hierarchyObject: CaHierarchyObject;
    }
  | {
      action: 'update';
      hierarchyObjectId: string;
      hierarchyObjectType: CaHierarchyObjectType;
      hierarchyObject: Partial<CaHierarchyObject>;
    }
  | {
      action: 'delete';
      hierarchyObjectId: string;
      hierarchyObjectType: CaHierarchyObjectType;
    }
  // special event to update the folder
  | {
      action: 'updateFolder';
      hierarchyObjectId: string;
      hierarchyObjectType: CaHierarchyObjectType;
      folder: CaFolder;
    };

/**
 * State to manage the events on hierarchy object in
 * hierarchy object page to sync the children, ancestors and left tree
 */
@Injectable()
export class CaHierarchyObjectEventState implements OnDestroy {
  private event$: Subject<CaHierarchyObjectEvent> = new Subject();

  public getEvent$(): Observable<CaHierarchyObjectEvent> {
    return this.event$.asObservable();
  }

  public emitEvent(event: CaHierarchyObjectEvent): void {
    this.event$.next(event);
  }

  public emitCreateEvent(hierarchyObject: CaHierarchyObject): void {
    this.emitEvent({
      action: 'create',
      hierarchyObjectId: hierarchyObject.id,
      hierarchyObjectType: hierarchyObject.objectType,
      hierarchyObject: hierarchyObject,
    });
  }

  public hierarchyObjectActionEvent(event: CaHierarchyObjectActionEvent): void {
    switch (event.entity) {
      case 'folder':
        this.emitFolderEvent(event.event);
        break;
      case 'document':
        this.emitDocumentEvent(event.event);
        break;
      case 'resource':
        this.emitResourceEvent(event.event);
        break;
      case 'note':
        this.emitNoteEvent(event.event);
        break;
    }
  }

  public emitFolderEvent(folderEvent: CaFolderActionEvent): void {
    switch (folderEvent.action) {
      case 'createChild':
        this.emitCreateEvent(folderEvent.folder.hierarchyRepresentation);
        break;
      case 'update':
        this.emitFolderUpdate(folderEvent.folder);
        break;
      case 'delete':
      case 'moveFolder':
        this.emitEvent({
          action: 'delete',
          hierarchyObjectId: folderEvent.folder.id,
          hierarchyObjectType: CaHierarchyObjectType.FOLDER,
        });
        break;
    }
  }

  public emitFolderUpdate(folder: CaFolder): void {
    this.emitEvent({
      action: 'update',
      hierarchyObjectId: folder.id,
      hierarchyObjectType: CaHierarchyObjectType.FOLDER,
      hierarchyObject: { name: folder.name, user: folder.leader, chatEnabled: folder.chatEnabled },
    });
    this.emitEvent({
      action: 'updateFolder',
      hierarchyObjectId: folder.id,
      hierarchyObjectType: CaHierarchyObjectType.FOLDER,
      folder: folder,
    });
  }

  public emitDocumentEvent(documentEvent: CaDocumentActionEvent): void {
    switch (documentEvent.action) {
      case 'update':
        this.emitEvent({
          action: 'update',
          hierarchyObjectId: documentEvent.document.id,
          hierarchyObjectType: CaHierarchyObjectType.DOCUMENT,
          hierarchyObject: { name: documentEvent.document.name },
        });
        break;
      case 'delete':
      case 'moveToTrash':
      case 'moveToFolder':
        this.emitEvent({
          action: 'delete',
          hierarchyObjectId: documentEvent.document.id,
          hierarchyObjectType: CaHierarchyObjectType.DOCUMENT,
        });
        break;
    }
  }

  public emitResourceEvent(resourceEvent: CaResourceActionEvent): void {
    switch (resourceEvent.action) {
      case 'moveToFolder':
      case 'deleteResource':
        this.emitEvent({
          action: 'delete',
          hierarchyObjectId: resourceEvent.resource.id,
          hierarchyObjectType: CaHierarchyObjectType.RESOURCE,
        });
    }
  }

  public emitNoteEvent(noteEvent: CaNoteActionEvent): void {
    switch (noteEvent.action) {
      case 'delete':
        this.emitEvent({
          action: 'delete',
          hierarchyObjectId: noteEvent.noteId,
          hierarchyObjectType: CaHierarchyObjectType.NOTE,
        });
        break;
    }
  }

  ngOnDestroy(): void {
    this.event$.complete();
  }
}
