import { Observable } from 'rxjs';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { TeTextEditorHistoryPortalComponent, TeTextEditorHistoryPortalData } from '@monorepo/text-editor';
import { Injector } from '@angular/core';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { CaNoteHistoryService } from '../../../ca-core/service/ca-note-history.service';
import { CaNoteTextEditorConfig } from './model/ca-note-text-editor-config.class';
import { CaRootFolderUserRoleObj } from '../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';

export type CaNoteActionEvent = CaHierarchyObjectMoveToFolderAction | CaHierarchyObjectMoveToTrashAction;

/**
 * Class to manage action menu for the note
 */
export class CaNoteActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(
    injector: Injector,
    hierarchyObjectId: string,
    protected userRole: CaRootFolderUserRoleObj,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, hierarchyObjectId, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const menu = [this.getOpenNoteButton()];

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

  protected getOpenNoteButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'open_note', translateText: true },
      icon: 'note',
      link: CaRouterService.getNoteDetailRoute(this.hierarchyObjectId),
    };
  }
}

export class CaNoteDetailActionMenu extends CaNoteActionMenu {
  constructor(
    injector: Injector,
    hierarchyObjectId: string,
    userRole: CaRootFolderUserRoleObj,
    private textEditorConfig: CaNoteTextEditorConfig,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, hierarchyObjectId, userRole, tags);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const menu = [];
    if (this.userRole.canEdit()) {
      menu.push(this.getManageTagsButton());
    }
    menu.push(this.getOpenHistoryPanelButton());
    if (this.userRole.canEdit()) {
      menu.push(this.getMoveToFolderButton(), this.getOpenTokensButton(), this.getMoveToTrashButton());
    }

    return this.generateMenu(menu, event);
  }

  private getOpenHistoryPanelButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'history', translateText: true },
      icon: 'history',
      onClick: () => this.openHistoryPanel(),
    };
  }

  private openHistoryPanel(): void {
    const portalService = this.injector.get(FlPortalService);
    portalService.createPortal(
      TeTextEditorHistoryPortalComponent,
      portalService.getRightSidePortalConfig(true),
      {
        service: this.injector.get(CaNoteHistoryService),
        entityId: this.hierarchyObjectId,
        textEditorConfig: this.textEditorConfig,
        isEditable: false,
      } as TeTextEditorHistoryPortalData
    );
  }
}
