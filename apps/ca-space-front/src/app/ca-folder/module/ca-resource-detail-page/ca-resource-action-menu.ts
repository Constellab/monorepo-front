import { Injector } from '@angular/core';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { Observable } from 'rxjs';

import { CaResourceBasicInfo } from '../../../ca-core/model/entities/folder/ca-resource.class';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaResourceService } from '../../../ca-core/service-api/ca-resource.service';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

export type CaResourceActionEvent = CaHierarchyObjectMoveToTrashAction | CaHierarchyObjectMoveToFolderAction;

export class CaResourceActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(
    injector: Injector,
    private resourceInfo: CaResourceBasicInfo,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, resourceInfo.id, tags);
  }

  public openActionMenu(
    event: MouseEvent,
    addOpenResourceButton: boolean = true
  ): Observable<CaResourceActionEvent> {
    const menu = [];

    if (addOpenResourceButton) {
      menu.push(this.getOpenResourceButton(), this.getOpenResourceInNewTabButton());
    }

    if (this.resourceInfo.userRole.canEdit()) {
      menu.push(this.getManageTagsButton(), this.getMoveToFolderButton(), this.getMoveToTrashButton());
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

  protected getOpenResourceInNewTabButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'open_resource_in_new_tab', translateText: true },
      icon: 'open_in_new',
      onClick: () => {
        const url = this.injector.get(CaResourceService).getRedirectUrl(this.hierarchyObjectId);
        window.open(url, '_blank');
      },
    };
  }
}
