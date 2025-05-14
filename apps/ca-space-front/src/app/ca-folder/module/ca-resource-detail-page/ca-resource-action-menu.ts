import { CaResourceBasicInfo } from '../../../ca-core/model/entities/folder/ca-resource.class';
import { Observable } from 'rxjs';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';

export type CaResourceActionEvent = CaHierarchyObjectMoveToTrashAction | CaHierarchyObjectMoveToFolderAction;

export class CaResourceActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(
    injector: Injector,
    private resourceInfo: CaResourceBasicInfo,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, resourceInfo.id, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaResourceActionEvent> {
    const menu = [this.getOpenResourceButton()];

    if (this.resourceInfo.userRole.canEdit()) {
      menu.push(
        this.getManageTagsButton(),
        this.getMoveToFolderButton(),
        this.getOpenTokensButton(),
        this.getMoveToTrashButton()
      );
    }
    return this.generateMenu(menu, event);
  }

  protected getOpenResourceButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'open_resource', translateText: true },
      icon: 'resource',
      link: CaRouterService.getResourceDetailRoute(this.hierarchyObjectId),
    };
  }
}
