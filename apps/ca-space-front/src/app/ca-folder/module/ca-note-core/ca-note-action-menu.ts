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

export type CaNoteActionEvent = CaHierarchyObjectMoveToFolderAction | CaHierarchyObjectMoveToTrashAction;

/**
 * Class to manage action menu for the note
 */
export class CaNoteActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(injector: Injector, hierarchyObjectId: string, tags?: CaHierarchyObjectActionTags) {
    super(injector, hierarchyObjectId, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const menu = [
      this.getManageTagsButton(),
      this.getMoveToFolderButton(),
      this.getOpenTokensButton(),
      this.getMoveToTrashButton(),
    ];

    return this.generateMenu(menu, event);
  }
}

export class CaNoteDetailActionMenu extends CaNoteActionMenu {
  constructor(
    injector: Injector,
    hierarchyObjectId: string,
    private textEditorConfig: CaNoteTextEditorConfig,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, hierarchyObjectId, tags);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const menu = [
      this.getManageTagsButton(),
      this.getOpenHistoryPanelButton(),
      this.getMoveToFolderButton(),
      this.getOpenTokensButton(),
      this.getMoveToTrashButton(),
    ];

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
