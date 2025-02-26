import { LabNote } from '../../../model/entities/lab-note.entity';
import { Injector } from '@angular/core';
import { LabTagDatasource } from '../../../model/entities/lab-tag.entity';
import { Observable } from 'rxjs';
import { LabNoteActionEvent, LabNoteActionMenu } from './lab-note-action-menu.class';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput,
} from '../../lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabFolder } from '../../../model/entities/lab-folder.class';
import { LabNoteDetailPageState } from '../../../../lab-note/module/lab-note-detail-page/lab-note-detail-page-state.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { LabNoteService } from '../../../entity-service/lab-note.service';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { TeTextEditorHistoryPortalComponent, TeTextEditorHistoryPortalData } from '@monorepo/text-editor';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LabNoteTextEditorConfig } from '../../../../lab-note/module/lab-note-detail-page/lab-note-text-editor-config.class';
import { LabNoteTemplate } from '../../../model/entities/lab-note-template.entity';
import { LabNoteTemplateService } from '../../../entity-service/lab-note-template.service';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { LabRouterService } from '../../../service/lab-router.service';
import { tap } from 'rxjs/operators';

export class LabNoteDetailActionMenu extends LabNoteActionMenu {
  constructor(
    injector: Injector,
    note: LabNote,
    tags: LabTagDatasource,
    private textEditorConfig: LabNoteTextEditorConfig
  ) {
    super(injector, note, tags);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<LabNoteActionEvent> {
    const menu = [this.getTagsButton('NOTE', this.note.id, this.tags)];

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
    const input: LabValidateObjectDialogInput = {
      title: 'biox.validate_note',
      validate: (folder: LabFolder): Observable<any> =>
        this.injector.get(LabNoteService).validate(this.note.id, folder.id),
      folder: this.note.folder,
      helpText: 'biox.validate_note_help_text',
      successMessage: 'biox.note_validated',
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LabValidateObjectDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onNoteUpdate(result));
  }

  private onNoteUpdate(note?: LabNote): void {
    if (note) {
      this.injector.get(LabNoteDetailPageState).updateNote(note);
    }
    this.subject.complete();
  }

  private openHistoryPanel(): void {
    const portalService = this.injector.get(FlPortalService);
    portalService.createPortal(TeTextEditorHistoryPortalComponent, portalService.getRightSidePortalConfig(), {
      service: this.injector.get(LabNoteService),
      entityId: this.note.id,
      textEditorConfig: this.textEditorConfig,
      isEditable: !this.note.isArchived,
    } as TeTextEditorHistoryPortalData);
    this.subject.complete();
  }

  private createNoteTemplate(): void {
    this.injector.get(FlPortalActionsService).addAction({
      type: 'create-note-template',
      action: this.injector.get(LabNoteTemplateService).createFromNote(this.note.id),
      text: { text: 'biox.create_note_template', translateText: true },
      successLink: (noteTemplate: LabNoteTemplate) =>
        LabRouterService.getNoteTemplateDetailRoute(noteTemplate.id),
    });
    this.subject.complete();
  }

  private delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_note',
      content: 'biox.delete_note_confirmation',
      observable: this.injector.get(LabNoteService).delete(this.note.id),
      successMessage: 'biox.note_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.deletedClosed(result));
  }

  private deletedClosed(result: FlConfirmDialogResult<LabNote>): void {
    if (result.choice) {
      this.injector.get(LabRouterService).navigateToNoteSearch();
    }
    this.subject.complete();
  }
}
