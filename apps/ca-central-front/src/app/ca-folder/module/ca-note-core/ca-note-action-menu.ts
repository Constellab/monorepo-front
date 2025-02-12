import { Observable } from 'rxjs';
import { CaHierarchyObjectBaseActionMenu } from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { CaNoteService } from '../../../ca-core/service-api/ca-note.service';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaHierarchyObjectTagDatasource } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { CaNoteTextEditorConfig } from './model/ca-note-text-editor-config.class';
import {
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';

export type CaNoteActionEvent = {
  action: 'delete';
  noteId: string;
};

/**
 * Class to manage action menu for the note
 */
export class CaNoteActionMenu extends CaHierarchyObjectBaseActionMenu<CaNoteActionEvent> {
  constructor(
    protected noteService: CaNoteService,
    dialogService: FlDialogService,
    menuDynamicService: FlMenuDynamicService,
    hierarchyObjectId: string,
    tags?: CaHierarchyObjectTagDatasource
  ) {
    super(dialogService, menuDynamicService, hierarchyObjectId, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaNoteActionEvent> {
    const menu = [this.getManageTagsButton(), this.getDeleteButton()];
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
      observable: this.noteService.deleteNote(this.hierarchyObjectId),
      successMessage: 'note_deleted',
    };

    this.dialogService
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
    noteService: CaNoteService,
    dialogService: FlDialogService,
    menuDynamicService: FlMenuDynamicService,
    hierarchyObjectId: string,
    private portalService: FlPortalService,
    private textEditorConfig: CaNoteTextEditorConfig,
    private noteHistoryService: TeTextEditorHistoryService,
    tags?: CaHierarchyObjectTagDatasource
  ) {
    super(noteService, dialogService, menuDynamicService, hierarchyObjectId, tags);
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
    this.portalService.createPortal(
      TeTextEditorHistoryPortalComponent,
      this.portalService.getRightSidePortalConfig(true),
      {
        service: this.noteHistoryService,
        entityId: this.hierarchyObjectId,
        textEditorConfig: this.textEditorConfig,
        isEditable: false,
      } as TeTextEditorHistoryPortalData
    );
  }
}
