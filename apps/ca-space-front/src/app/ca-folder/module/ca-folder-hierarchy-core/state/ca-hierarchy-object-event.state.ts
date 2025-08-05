import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CaFolderDetailActionEvent } from '../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-detail-action-menu.class';
import { CaFolder } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaDocumentActionEvent } from '../../ca-document-core/ca-document-action-menu';
import { CaHierarchyObjectActionEvent } from '../../ca-folder-detail-page/ca-hierarchy-object-action-menu';
import {
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

export type CaHierarchyObjectEvent =
  | {
      action: 'create';
      hierarchyObjectId: string;
      hierarchyObjectType: CaHierarchyObjectType;
      hierarchyObject: CaHierarchyObject;
      navigateToObject: boolean;
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

  public emitRenameEvent(
    hierarchyObjectId: string,
    hierarchyObjectType: CaHierarchyObjectType,
    name: string
  ): void {
    this.emitEvent({
      action: 'update',
      hierarchyObjectId: hierarchyObjectId,
      hierarchyObjectType: hierarchyObjectType,
      hierarchyObject: { name: name },
    });
  }

  public emitCreateEvent(hierarchyObject: CaHierarchyObject, navigateToObject: boolean): void {
    this.emitEvent({
      action: 'create',
      hierarchyObjectId: hierarchyObject.id,
      hierarchyObjectType: hierarchyObject.objectType,
      hierarchyObject: hierarchyObject,
      navigateToObject: navigateToObject,
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
      case 'note':
      case 'scenario':
        this.emitHierarchyObjectEvent(event.event);
        break;
    }
  }

  public emitFolderEvent(folderEvent: CaFolderDetailActionEvent): void {
    switch (folderEvent.action) {
      case 'createChild':
        this.emitCreateEvent(folderEvent.folder.hierarchyRepresentation, true);
        break;
      case 'update':
        this.emitFolderUpdate(folderEvent.folder);
        break;
      case 'moveToFolder':
      case 'moveToTrash':
        this.emitHierarchyObjectEvent(folderEvent);
        break;
      case 'restoreObjectFromTrash':
        for (const hierarchyObject of folderEvent.hierarchyObjects) {
          this.emitCreateEvent(hierarchyObject, false);
        }
        break;
    }
  }

  public emitFolderUpdate(folder: CaFolder): void {
    this.emitEvent({
      action: 'update',
      hierarchyObjectId: folder.id,
      hierarchyObjectType: CaHierarchyObjectType.FOLDER,
      hierarchyObject: { name: folder.name, user: folder.lastModifiedBy, chatEnabled: folder.chatEnabled },
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
      case 'moveToFolder':
      case 'moveToTrash':
        this.emitHierarchyObjectEvent(documentEvent);
        break;
    }
  }

  public emitHierarchyObjectEvent(
    hierarchyObjectEvent: CaHierarchyObjectMoveToTrashAction | CaHierarchyObjectMoveToFolderAction
  ): void {
    this.emitEvent({
      action: 'delete',
      hierarchyObjectId: hierarchyObjectEvent.hierarchyObject.id,
      hierarchyObjectType: hierarchyObjectEvent.hierarchyObject.objectType,
    });
  }

  ngOnDestroy(): void {
    this.event$.complete();
  }
}
