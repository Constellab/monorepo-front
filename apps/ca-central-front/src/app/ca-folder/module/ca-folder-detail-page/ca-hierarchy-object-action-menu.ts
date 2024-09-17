import { FlDialogService, FlMenuDynamicService, FlPortalActionsService } from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import {
  CaHierarchyObject,
  CaHierarchyObjectType
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu
} from '../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { CaDocumentActionEvent, CaDocumentActionMenu } from '../ca-document-core/ca-document-action-menu';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export type CaHierarchyObjectActionEvent = {
  entity: 'folder';
  event: CaFolderActionEvent;
} | {
  entity: 'document';
  event: CaDocumentActionEvent;
}

export class CaHierarchyObjectActionMenu {

  constructor(private dialogService: FlDialogService,
              private folderService: CaFolderService,
              private actionService: FlPortalActionsService,
              private menuDynamicService: FlMenuDynamicService,
              private hierarchyObject: CaHierarchyObject) {
  }

  public openActionMenu(event: MouseEvent): Observable<CaHierarchyObjectActionEvent | null> {
    if (this.hierarchyObject.objectType === CaHierarchyObjectType.FOLDER) {
      return this.openFolderActionMenu(event).pipe(
        map(event => event ? { entity: 'folder', event } : null)
      );
    } else if (this.hierarchyObject.objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT ||
      this.hierarchyObject.objectType === CaHierarchyObjectType.DOCUMENT) {
      return this.openDocumentActionMenu(event).pipe(
        map(event => event ? { entity: 'document', event } : null)
      );
    } else {
      return of(null);
    }
  }

  private openFolderActionMenu(event: MouseEvent): Observable<CaFolderActionEvent | null> {
    const folderActionsMenu = new CaFolderActionsMenu(this.dialogService, this.folderService,
      this.menuDynamicService,
      {
        id: this.hierarchyObject.id,
        title: this.hierarchyObject.name,
        leader: this.hierarchyObject.user
      });
    return folderActionsMenu.openActionMenu(event);
  }

  private openDocumentActionMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const service = new CaDocumentActionMenu(this.dialogService, this.folderService,
      this.menuDynamicService,
      this.actionService,
      {
        id: this.hierarchyObject.id,
        name: this.hierarchyObject.name,
        inTrash: false, // if the folder is visible, it is not in trash
        isConstellabDocument: this.hierarchyObject.objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT
      });
    return service.openActionMenu(true, event);
  }
}
