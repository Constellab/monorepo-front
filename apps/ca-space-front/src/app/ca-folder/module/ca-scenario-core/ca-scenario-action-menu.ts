import { Injector } from '@angular/core';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { Observable } from 'rxjs';
import { FlEntityArrayObs } from '../../../../../../../libs/front-core-lib/src/lib/fl-core';
import { FlDialogService } from '../../../../../../../libs/front-core-lib/src/lib/fl-dialog';
import { CaRootFolderUserRoleObj } from '../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaNoteService } from '../../../ca-core/service-api/ca-note.service';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import {
  CaNoteTableDialogComponent,
  CaNoteTableDialogInput,
} from '../ca-note-core/component/ca-note-table-dialog/ca-note-table-dialog.component';

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

  public openActionMenu(
    event: MouseEvent,
    addOpenScenarioButton: boolean = true
  ): Observable<CaScenarioActionEvent | null> {
    const menu = [];

    if (addOpenScenarioButton) {
      menu.push(this.getOpenScenarioButton());
    }

    if (this.userRole.canEdit()) {
      menu.push(
        this.getOpenAssociatedNotesButton(),
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

  protected getOpenAssociatedNotesButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'scenario_associated_notes', translateText: true },
      icon: 'note',
      onClick: () => this.openNoteListDialog(),
    };
  }

  private openNoteListDialog(): void {
    const notes = new FlEntityArrayObs(
      this.injector.get(CaNoteService).getNotesByScenario(this.hierarchyObjectId)
    );

    const input: CaNoteTableDialogInput = {
      notes: notes,
      title: { text: 'scenario_associated_notes', translateText: true },
    };

    this.injector.get(FlDialogService).openMediumDialog(CaNoteTableDialogComponent, {
      data: input,
    });
  }
}
