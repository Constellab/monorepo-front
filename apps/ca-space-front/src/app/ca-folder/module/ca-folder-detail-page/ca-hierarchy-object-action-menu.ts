import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu,
} from '../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { CaDocumentActionEvent, CaDocumentActionMenu } from '../ca-document-core/ca-document-action-menu';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CaResourceActionEvent,
  CaResourceActionMenu,
} from '../ca-resource-detail-page/ca-resource-action-menu';
import { CaNoteActionEvent, CaNoteActionMenu } from '../ca-note-core/ca-note-action-menu';
import { CaScenarioActionEvent, CaScenarioActionMenu } from '../ca-scenario-core/ca-scenario-action-menu';
import { CaHierarchyObjectActionTags } from './ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { CaRootFolderUserRoleObj } from '../../../ca-core/model/entities/folder/ca-folder-user.class';

export type CaHierarchyObjectActionEvent =
  | {
      entity: 'folder';
      event: CaFolderActionEvent;
    }
  | {
      entity: 'document';
      event: CaDocumentActionEvent;
    }
  | {
      entity: 'resource';
      event: CaResourceActionEvent;
    }
  | {
      entity: 'note';
      event: CaNoteActionEvent;
    }
  | {
      entity: 'scenario';
      event: CaScenarioActionEvent;
    };

/**
 * Action menu for the hierarchy object in the folder children list.
 * It calls the correct action menu based on the object type.
 */
export class CaHierarchyObjectActionMenu {
  constructor(
    private injector: Injector,
    private hierarchyObject: CaHierarchyObject,
    private userRole: CaRootFolderUserRoleObj,
    private tags: CaHierarchyObjectActionTags
  ) {}

  public openActionMenu(event: MouseEvent): Observable<CaHierarchyObjectActionEvent | null> {
    if (this.hierarchyObject.objectType === CaHierarchyObjectType.FOLDER) {
      return this.openFolderActionMenu(event).pipe(
        map((event) => (event ? { entity: 'folder', event } : null))
      );
    } else if (
      this.hierarchyObject.objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT ||
      this.hierarchyObject.objectType === CaHierarchyObjectType.DOCUMENT
    ) {
      return this.openDocumentActionMenu(event).pipe(
        map((event) => (event ? { entity: 'document', event } : null))
      );
    } else if (this.hierarchyObject.objectType === CaHierarchyObjectType.RESOURCE) {
      return this.openResourceActionMenu(event).pipe(
        map((event) => (event ? { entity: 'resource', event } : null))
      );
    } else if (this.hierarchyObject.objectType === CaHierarchyObjectType.NOTE) {
      return this.openNoteActionMenu(event).pipe(map((event) => (event ? { entity: 'note', event } : null)));
    } else if (this.hierarchyObject.objectType === CaHierarchyObjectType.SCENARIO) {
      return this.openScenarioActionMenu(event).pipe(
        map((event) => (event ? { entity: 'scenario', event } : null))
      );
    } else {
      return of(null);
    }
  }

  private openFolderActionMenu(event: MouseEvent): Observable<CaFolderActionEvent | null> {
    const folderActionsMenu = new CaFolderActionsMenu(
      this.injector,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
        userRole: this.userRole,
      },
      this.tags
    );
    return folderActionsMenu.openTableItemActionMenu(event);
  }

  private openDocumentActionMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const service = new CaDocumentActionMenu(
      this.injector,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
        isConstellabDocument: this.hierarchyObject.objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT,
        userRole: this.userRole,
      },
      this.tags
    );
    return service.openDefaultActionMenu(event);
  }

  private openResourceActionMenu(event: MouseEvent): Observable<CaResourceActionEvent | null> {
    const resourceActionsMenu = new CaResourceActionMenu(
      this.injector,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
        userRole: this.userRole,
      },
      this.tags
    );

    return resourceActionsMenu.openActionMenu(event);
  }

  private openNoteActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const noteActionMenu = new CaNoteActionMenu(
      this.injector,
      this.hierarchyObject.id,
      this.userRole,
      this.tags
    );
    return noteActionMenu.openActionMenu(event);
  }

  private openScenarioActionMenu(event: MouseEvent): Observable<CaScenarioActionEvent | null> {
    const scenarioActionMenu = new CaScenarioActionMenu(
      this.injector,
      this.hierarchyObject.id,
      this.userRole,
      this.tags
    );
    return scenarioActionMenu.openActionMenu(event);
  }
}
