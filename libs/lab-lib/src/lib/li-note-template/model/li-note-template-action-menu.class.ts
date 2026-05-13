import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import {
  LiNoteTemplate,
  LiNoteTemplateService,
  LiRouterService,
  LiTagDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import { Observable } from 'rxjs';

export type LiNoteTemplateActionEvent = {
  action: 'delete';
  noteTemplate: LiNoteTemplate;
};

export class LiNoteTemplateActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected noteTemplate: LiNoteTemplate,
    protected tags: LiTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LiNoteTemplateActionEvent> {
    const menu = [
      this.getCreateNoteButton(),
      this.getTagsButton('NOTE_TEMPLATE', this.noteTemplate.id, this.tags),
      this.getDeleteButton(),
    ];

    return this.generateMenu(menu, event);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<LiNoteTemplateActionEvent> {
    const menu: FlMenuDynamic[] = [
      this.getCreateNoteButton(),
      this.getPrintButton(),
      this.getTagsButton('NOTE_TEMPLATE', this.noteTemplate.id, this.tags),
      this.getDeleteButton(),
    ];

    return this.generateMenu(menu, event);
  }

  ////////////////////////////////////////// BUTTONS //////////////////////////////////////////

  protected getCreateNoteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.create_note_from_template',
      icon: 'note',
      onClick: () => this.openCreateNoteDialog(),
    };
  }

  protected getPrintButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.print',
      icon: 'print',
      onClick: () => window.print(),
    };
  }

  protected getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.delete_note_template',
      icon: 'delete',
      color: 'warn',
      onClick: () => this.confirmDelete(),
    };
  }

  ////////////////////////////////////////// ACTIONS //////////////////////////////////////////

  private async openCreateNoteDialog(): Promise<void> {
    const { LiNoteFormDialogComponent } =
      await import('../../li-note/component/li-note-form-dialog/li-note-form-dialog.component');

    const data = {
      mode: 'create' as const,
      template: this.noteTemplate,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiNoteFormDialogComponent, { data })
      .afterClosed()
      .subscribe((note) => {
        if (note) {
          this.injector.get(LiRouterService).navigateToNoteDetail(note.id);
        }
        this.subject.complete();
      });
  }

  private confirmDelete(): void {
    const input: FlConfirmDialogInput = {
      title: 'li.delete_note_template',
      content: 'li.delete_note_template_confirmation',
      observable: this.injector.get(LiNoteTemplateService).delete(this.noteTemplate.id),
      successMessage: 'li.note_template_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult<void>): void {
    if (result.choice) {
      this.subject.next({ action: 'delete', noteTemplate: this.noteTemplate });
    }
    this.subject.complete();
  }
}
