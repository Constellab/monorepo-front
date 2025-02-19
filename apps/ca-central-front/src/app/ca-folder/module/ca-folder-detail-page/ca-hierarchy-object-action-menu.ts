import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
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
import { CaSecurityService } from '../../../ca-core/service/ca-security.service';
import { CaFolderActionService } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import {
  CaResourceActionEvent,
  CaResourceActionMenu,
} from '../ca-resource-detail-page/ca-resource-action-menu';
import { CaResourceService } from '../../../ca-core/service-api/ca-resource.service';
import { CaNoteActionEvent, CaNoteActionMenu } from '../ca-note-core/ca-note-action-menu';
import { CaScenarioActionMenu } from '../ca-scenario-core/ca-scenario-action-menu';
import { CaNoteService } from '../../../ca-core/service-api/ca-note.service';
import { CaHierarchyObjectActionTags } from './ca-hierarchy-object-base-action-menu';

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
    };

/**
 * Action menu for the hierarchy object in the folder children list.
 * It calls the correct action menu based on the object type.
 */
export class CaHierarchyObjectActionMenu {
  constructor(
    private dialogService: FlDialogService,
    private folderService: CaFolderService,
    private folderActionService: CaFolderActionService,
    private actionService: FlPortalActionsService,
    private menuDynamicService: FlMenuDynamicService,
    private securityService: CaSecurityService,
    private resourceService: CaResourceService,
    private noteService: CaNoteService,
    private hierarchyObject: CaHierarchyObject,
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
      return this.openScenarioActionMenu(event);
    } else {
      return of(null);
    }
  }

  private openFolderActionMenu(event: MouseEvent): Observable<CaFolderActionEvent | null> {
    const folderActionsMenu = new CaFolderActionsMenu(
      this.dialogService,
      this.folderActionService,
      this.menuDynamicService,
      this.securityService,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
        leader: this.hierarchyObject.user,
      },
      this.tags
    );
    return folderActionsMenu.openTableItemActionMenu(event);
  }

  private openDocumentActionMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const service = new CaDocumentActionMenu(
      this.dialogService,
      this.folderService,
      this.menuDynamicService,
      this.actionService,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
        inTrash: false, // if the folder is visible, it is not in trash
        isConstellabDocument: this.hierarchyObject.objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT,
      },
      this.tags
    );
    return service.openDefaultActionMenu(event);
  }

  private openResourceActionMenu(event: MouseEvent): Observable<CaResourceActionEvent | null> {
    const resourceActionsMenu = new CaResourceActionMenu(
      this.resourceService,
      this.menuDynamicService,
      this.dialogService,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
      },
      this.tags
    );

    return resourceActionsMenu.openActionMenu(event);
  }

  private openNoteActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const noteActionMenu = new CaNoteActionMenu(
      this.noteService,
      this.dialogService,
      this.menuDynamicService,
      this.hierarchyObject.id,
      this.tags
    );
    return noteActionMenu.openActionMenu(event);
  }

  private openScenarioActionMenu(event: MouseEvent): Observable<null> {
    const scenarioActionMenu = new CaScenarioActionMenu(
      this.dialogService,
      this.menuDynamicService,
      this.hierarchyObject.id,
      this.tags
    );
    return scenarioActionMenu.openActionMenu(event);
  }
}
