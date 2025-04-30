import { Observable } from 'rxjs';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { TeTextEditorHistoryPortalComponent, TeTextEditorHistoryPortalData } from '@monorepo/text-editor';
import { Injector } from '@angular/core';
import { CaNoteService } from '../../../ca-core/service-api/ca-note.service';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { CaNoteHistoryService } from '../../../ca-core/service/ca-note-history.service';
import { CaNoteTextEditorConfig } from './model/ca-note-text-editor-config.class';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';

export type CaNoteActionEvent = {
  action: 'delete';
  noteId: string;
};

/**
 * Class to manage action menu for the note
 */
export class CaNoteActionMenu extends CaHierarchyObjectBaseActionMenu<CaNoteActionEvent> {
  constructor(injector: Injector, hierarchyObjectId: string, tags?: CaHierarchyObjectActionTags) {
    super(injector, hierarchyObjectId, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const menu = [this.getManageTagsButton()];
    const isAdmin = this.injector.get(CaAuthenticatedUserService).isAdmin();

    if (isAdmin) {
      menu.push(this.getDeleteButton());
    }
    return this.generateMenu(menu, event);
  }

  protected getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'delete_note', translateText: true },
      icon: 'delete',
      onClick: () => this.deleteNote(),
      color: 'warn',
    };
  }

  private deleteNote(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_note',
      content: 'delete_note_confirmation',
      observable: this.injector.get(CaNoteService).deleteNote(this.hierarchyObjectId),
      successMessage: 'note_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onNoteDeleted(result));
  }

  private onNoteDeleted(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.subject.next({ action: 'delete', noteId: this.hierarchyObjectId });
    }

    this.subject.complete();
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
    const menu = [this.getManageTagsButton()];

    menu.push(this.getOpenHistoryPanelButton());

    menu.push(this.getDeleteButton());

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
