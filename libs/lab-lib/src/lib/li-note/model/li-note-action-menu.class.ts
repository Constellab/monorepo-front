import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicInput } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { LiNote, LiNoteService, LiTagDatasource } from '@monorepo/lab-lib/li-core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import { Observable } from 'rxjs';

export type LiNoteActionEvent = {
  action: 'archive' | 'unarchive';
  note: LiNote;
};

export class LiNoteActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected note: LiNote,
    protected tags?: LiTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LiNoteActionEvent> {
    const menu: FlMenuDynamicInput = [
      this.getTagsButton('NOTE', this.note.id, this.tags),
      this.getArchiveButton(),
      this.getExtensionsButton('NOTE', this.note.id),
    ];

    return this.generateMenu(menu, event);
  }

  ////////////////////////////////////////// BUTTONS //////////////////////////////////////////

  protected getArchiveButton(): FlMenuDynamic {
    if (this.note.isArchived) {
      return {
        type: 'button',
        text: 'li.unarchive_note',
        icon: 'unarchive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.unarchive_note',
            content: 'li.unarchive_note_confirmation',
            observable: this.injector.get(LiNoteService).unarchive(this.note.id),
            successMessage: 'li.note_unarchived',
          }),
      };
    } else {
      return {
        type: 'button',
        text: 'li.archive_note',
        icon: 'archive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.archive_note',
            content: 'li.archive_note_confirmation',
            observable: this.injector.get(LiNoteService).archive(this.note.id),
            successMessage: 'li.note_archived',
          }),
      };
    }
  }

  ////////////////////////////////////////// ACTIONS //////////////////////////////////////////

  private toggleArchive(dialogInput: FlConfirmDialogInput): void {
    this.injector
      .get(FlDialogService)
      .openConfirmDialog(dialogInput)
      .afterClosed()
      .subscribe((result) => this.onArchiveClosed(result));
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LiNote>): void {
    const note = result.result;
    if (result.choice && note) {
      if (note.isArchived) {
        this.subject.next({ action: 'archive', note });
      } else {
        this.subject.next({ action: 'unarchive', note });
      }
    }

    this.subject.complete();
  }
}
