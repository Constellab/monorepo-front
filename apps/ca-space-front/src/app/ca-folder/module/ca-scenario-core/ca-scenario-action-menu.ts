import { Observable } from 'rxjs';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { CaRootFolderUserRoleObj } from '../../../ca-core/model/entities/folder/ca-folder-user.class';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';

export type CaScenarioActionEvent = CaHierarchyObjectMoveToFolderAction | CaHierarchyObjectMoveToTrashAction;

/**
 * Class to manage action menu for the scenario
 */
export class CaScenarioActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(
    injector: Injector,
    hierarchyObjectId: string,
    private userRole: CaRootFolderUserRoleObj,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, hierarchyObjectId, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaScenarioActionEvent | null> {
    const menu = [this.getOpenScenarioButton()];

    if (this.userRole.canEdit()) {
      menu.push(
        this.getManageTagsButton(),
        this.getMoveToFolderButton(),
        this.getOpenTokensButton(),
        this.getMoveToTrashButton()
      );
    }
    return this.generateMenu(menu, event);
  }

  protected getOpenScenarioButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'open_scenario', translateText: true },
      icon: 'scenario',
      link: CaRouterService.getScenarioDetailRoute(this.hierarchyObjectId),
    };
  }
}
