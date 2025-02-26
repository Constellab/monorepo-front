import { LabNote } from '../../../model/entities/lab-note.entity';
import { Injector } from '@angular/core';
import { LabEntityActionMenu } from '../../lab-entity-core/lab-entity-action-menu.class';
import { LabTagDatasource } from '../../../model/entities/lab-tag.entity';
import { Observable } from 'rxjs';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { LabNoteService } from '../../../entity-service/lab-note.service';

export type LabNoteActionEvent = {
  action: 'archive' | 'unarchive';
  note: LabNote;
};

export class LabNoteActionMenu extends LabEntityActionMenu<LabNoteActionEvent> {
  constructor(
    injector: Injector,
    protected note: LabNote,
    protected tags: LabTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LabNoteActionEvent> {
    const menu = [this.getTagsButton('NOTE', this.note.id, this.tags), this.getArchiveButton()];

    return this.generateMenu(menu, event);
  }

  ////////////////////////////////////////// BUTTONS //////////////////////////////////////////

  protected getArchiveButton(): FlMenuDynamic {
    if (this.note.isArchived) {
      return {
        type: 'button',
        text: 'biox.unarchive_note',
        icon: 'unarchive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'biox.unarchive_note',
            content: 'biox.unarchive_note_confirmation',
            observable: this.injector.get(LabNoteService).unarchive(this.note.id),
            successMessage: 'biox.note_unarchived',
          }),
      };
    } else {
      return {
        type: 'button',
        text: 'biox.archive_note',
        icon: 'archive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'biox.archive_note',
            content: 'biox.archive_note_confirmation',
            observable: this.injector.get(LabNoteService).archive(this.note.id),
            successMessage: 'biox.note_archived',
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

  private onArchiveClosed(result: FlConfirmDialogResult<LabNote>): void {
    if (result.choice) {
      if (result.result.isArchived) {
        this.subject.next({ action: 'archive', note: result.result });
      } else {
        this.subject.next({ action: 'unarchive', note: result.result });
      }
    }

    this.subject.complete();
  }
}
