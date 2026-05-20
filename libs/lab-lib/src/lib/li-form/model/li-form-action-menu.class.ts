import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicInput } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LiTagDatasource } from '@monorepo/lab-lib/li-core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { LiForm } from '../../li-core/model/entities/form/li-form.entity';
import {
  LiFormHistoryPortalComponent,
  LiFormHistoryPortalData,
} from '../component/li-form-history-portal/li-form-history-portal.component';
import { LiFormService } from '../service/li-form.service';

export type LiFormActionEvent = {
  action: 'archive' | 'unarchive' | 'delete';
  form: LiForm;
};

export class LiFormActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected form: LiForm,
    protected tags?: LiTagDatasource,
    protected specs?: TdParamSpecs
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LiFormActionEvent> {
    const menu: FlMenuDynamicInput = [
      this.getTagsButton('FORM', this.form.id),
      this.getHistoryButton(),
      this.getViewNotesButton(),
      this.getArchiveButton(),
      this.getDeleteButton(),
      this.getExtensionsButton('FORM', this.form.id),
    ];

    return this.generateMenu(menu, event);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<LiFormActionEvent> {
    const menu: FlMenuDynamicInput = [
      this.getTagsButton('FORM', this.form.id),
      this.getHistoryButton(),
      this.getViewNotesButton(),
      this.getArchiveButton(),
      this.getDeleteButton(),
      this.getExtensionsButton('FORM', this.form.id),
    ];

    return this.generateMenu(menu, event);
  }

  protected getHistoryButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.form_history',
      icon: 'history',
      onClick: () => this.openHistoryPanel(),
    };
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

  protected getViewNotesButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.form_search_notes',
      icon: 'search',
      onClick: () => this.openViewNotesDialog(),
    };
  }

  private async openViewNotesDialog(): Promise<void> {
    const { LiSelectNoteDialogComponent } = await import('@monorepo/lab-lib/li-note');
    type LiSelectNoteDialogInput = import('@monorepo/lab-lib/li-note').LiSelectNoteDialogInput;

    const data: LiSelectNoteDialogInput = {
      mode: 'link',
      title: 'li.form_dialog_notes_title',
      defaultFilters: { formId: this.form as any },
      disabledFilters: { formId: true },
    };

    this.injector
      .get(FlDialogService)
      .openBigDialog(LiSelectNoteDialogComponent, { data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private openHistoryPanel(): void {
    const portalService = this.injector.get(FlPortalService);
    const data: LiFormHistoryPortalData = { formId: this.form.id, specs: this.specs };
    portalService.createPortal(LiFormHistoryPortalComponent, portalService.getRightSidePortalConfig(), data);
    this.subject.complete();
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
        content: 'li.form_delete_confirmation',
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
