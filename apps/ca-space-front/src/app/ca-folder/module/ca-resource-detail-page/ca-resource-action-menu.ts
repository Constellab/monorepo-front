import { CaResourceBasicInfo } from '../../../ca-core/model/entities/folder/ca-resource.class';
import { Observable } from 'rxjs';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';

export type CaResourceActionEvent = CaHierarchyObjectMoveToTrashAction | CaHierarchyObjectMoveToFolderAction;

export class CaResourceActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(injector: Injector, resourceInfo: CaResourceBasicInfo, tags?: CaHierarchyObjectActionTags) {
    super(injector, resourceInfo.id, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaResourceActionEvent> {
    const menu = [
      this.getManageTagsButton(),
      this.getMoveToFolderButton(),
      this.getOpenTokensButton(),
      this.getMoveToTrashButton(),
    ];
    return this.generateMenu(menu, event);
  }
}
