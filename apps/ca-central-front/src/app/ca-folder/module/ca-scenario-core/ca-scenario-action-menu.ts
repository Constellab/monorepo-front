import { Observable } from 'rxjs';
import {
  CaHierarchyObjectBaseActionMenu,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

/**
 * Class to manage action menu for the scenario
 */
export class CaScenarioActionMenu extends CaHierarchyObjectBaseActionMenu<null> {
  public openActionMenu(event: MouseEvent): Observable<null> {
    const menu = [this.getManageTagsButton()];
    return this.generateMenu(menu, event);
  }
}
