import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicInput } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  LiFolder,
  LiNote,
  LiNoteService,
  LiNoteTemplate,
  LiNoteTemplateService,
  LiRouterService,
  LiTagDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiValidateObjectDialogComponent, LiValidateObjectDialogInput } from '@monorepo/lab-lib/li-entity';
import { LiNoteActionEvent, LiNoteActionMenu } from '@monorepo/lab-lib/li-note';
import { TeTextEditorHistoryPortalComponent, TeTextEditorHistoryPortalData } from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LabNoteDetailPageState } from './lab-note-detail-page-state.service';
import { LabNoteTextEditorConfig } from './lab-note-text-editor-config.class';

export class LabNoteDetailActionMenu extends LiNoteActionMenu {
  constructor(
    injector: Injector,
    note: LiNote,
    tags: LiTagDatasource,
    private textEditorConfig: LabNoteTextEditorConfig
  ) {
    super(injector, note, tags);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<LiNoteActionEvent> {
    const menu: FlMenuDynamicInput = [this.getTagsButton('NOTE', this.note.id)];

    if (this.note.isEditable()) {
      menu.push(this.getValidateButton());
    }
    menu.push(this.getPrintButton());
    menu.push(this.getHistoryButton());
    menu.push(this.getCreateTemplateButton());
    menu.push(this.getArchiveButton());

    if (this.note.isEditable()) {
      menu.push(this.getDeleteButton());
    }

    menu.push(this.getExtensionsButton('NOTE', this.note.id));

    return this.generateMenu(menu, event).pipe(
      tap((event) => this.injector.get(LabNoteDetailPageState).updateNote(event.note))
    );
  }

  ////////////////////////////////////////// BUTTONS //////////////////////////////////////////
  private getValidateButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.validate_note',
      icon: 'validated',
      onClick: () => this.validate(),
    };
  }

  private getHistoryButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.history',
      icon: 'history',
      onClick: () => this.openHistoryPanel(),
    };
  }

  private getPrintButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.print_note',
      icon: 'print',
      onClick: () => {
        if (window) {
          window.print();
        }
      },
    };
  }

  private getCreateTemplateButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.create_note_template',
      icon: 'note',
      onClick: () => this.createNoteTemplate(),
    };
  }

  private getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.delete_note',
      icon: 'delete',
      color: 'warn',
      onClick: () => this.delete(),
    };
  }

  ////////////////////////////////////////// ACTIONS //////////////////////////////////////////

  private validate(): void {
    const input: LiValidateObjectDialogInput = {
      title: 'biox.validate_note',
      validate: (folder: LiFolder): Observable<any> =>
        this.injector.get(LiNoteService).validate(this.note.id, folder.id),
      folder: this.note.folder,
      helpText: 'biox.validate_note_help_text',
      successMessage: 'biox.note_validated',
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiValidateObjectDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onNoteUpdate(result));
  }

  private onNoteUpdate(note?: LiNote): void {
    if (note) {
      this.injector.get(LabNoteDetailPageState).updateNote(note);
    }
    this.subject.complete();
  }

  private openHistoryPanel(): void {
    const portalService = this.injector.get(FlPortalService);
    portalService.createPortal(TeTextEditorHistoryPortalComponent, portalService.getRightSidePortalConfig(), {
      service: this.injector.get(LiNoteService),
      entityId: this.note.id,
      textEditorConfig: this.textEditorConfig,
      isEditable: !this.note.isArchived,
    } as TeTextEditorHistoryPortalData);
    this.subject.complete();
  }

  private createNoteTemplate(): void {
    this.injector.get(FlPortalActionsService).addAction({
      type: 'create-note-template',
      action: this.injector.get(LiNoteTemplateService).createFromNote(this.note.id),
      text: { text: 'biox.create_note_template', translateText: true },
      successLink: (noteTemplate: LiNoteTemplate) =>
        LiRouterService.getNoteTemplateDetailRoute(noteTemplate.id),
    });
    this.subject.complete();
  }

  private delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_note',
      content: 'biox.delete_note_confirmation',
      observable: this.injector.get(LiNoteService).delete(this.note.id),
      successMessage: 'biox.note_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.deletedClosed(result));
  }

  private deletedClosed(result: FlConfirmDialogResult<LiNote>): void {
    if (result.choice) {
      this.injector.get(LiRouterService).navigateToNoteSearch();
    }
    this.subject.complete();
  }
}
