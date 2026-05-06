import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { LiTagDatasource } from '@monorepo/lab-lib/li-core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import { Observable } from 'rxjs';

import { LiFormService } from '../service/li-form.service';
import { LiForm } from './li-form.entity';

export type LiFormActionEvent = {
  action: 'archive' | 'unarchive' | 'delete';
  form: LiForm;
};

export class LiFormActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected form: LiForm,
    protected tags: LiTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LiFormActionEvent> {
    const menu = [
      this.getTagsButton('FORM', this.form.id, this.tags),
      this.getArchiveButton(),
      this.getDeleteButton(),
    ];

    return this.generateMenu(menu, event);
  }

  protected getArchiveButton(): FlMenuDynamic {
    if (this.form.isArchived) {
      return {
        type: 'button',
        text: 'li.form_unarchive',
        icon: 'unarchive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.form_unarchive',
            content: 'li.unarchive_form_confirmation',
            observable: this.injector.get(LiFormService).unarchive(this.form.id),
            successMessage: 'li.form_unarchived',
          }),
      };
    } else {
      return {
        type: 'button',
        text: 'li.form_archive',
        icon: 'archive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.form_archive',
            content: 'li.archive_form_confirmation',
            observable: this.injector.get(LiFormService).archive(this.form.id),
            successMessage: 'li.form_archived',
          }),
      };
    }
  }

  protected getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.form_delete',
      icon: 'delete',
      color: 'warn',
      onClick: () => this.confirmDelete(),
    };
  }

  private toggleArchive(dialogInput: FlConfirmDialogInput): void {
    this.injector
      .get(FlDialogService)
      .openConfirmDialog(dialogInput)
      .afterClosed()
      .subscribe((result) => this.onArchiveClosed(result));
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LiForm>): void {
    if (result.choice) {
      this.subject.next({
        action: result.result.isArchived ? 'archive' : 'unarchive',
        form: result.result,
      });
    }

    this.subject.complete();
  }

  private confirmDelete(): void {
    this.injector
      .get(FlDialogService)
      .openConfirmDialog({
        title: 'li.form_delete',
        content: 'li.delete_form_confirmation',
        observable: this.injector.get(LiFormService).delete(this.form.id),
        successMessage: 'li.form_deleted',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.choice) {
          this.subject.next({ action: 'delete', form: this.form });
        }
        this.subject.complete();
      });
  }
}
