import { Observable } from 'rxjs';
import {
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

export type CaScenarioActionEvent = CaHierarchyObjectMoveToFolderAction | CaHierarchyObjectMoveToTrashAction;

/**
 * Class to manage action menu for the scenario
 */
export class CaScenarioActionMenu extends CaHierarchyObjectBaseActionMenu {
  public openActionMenu(event: MouseEvent): Observable<CaScenarioActionEvent | null> {
    const menu = [this.getManageTagsButton(), this.getMoveToFolderButton(), this.getMoveToTrashButton()];
    return this.generateMenu(menu, event);
  }
}
