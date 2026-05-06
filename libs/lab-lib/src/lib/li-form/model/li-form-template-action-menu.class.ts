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

import { LiFormTemplateService } from '../service/li-form-template.service';
import { LiFormTemplate } from './li-form-template.entity';

export type LiFormTemplateActionEvent = {
  action: 'archive' | 'unarchive' | 'delete';
  template: LiFormTemplate;
};

export class LiFormTemplateActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected template: LiFormTemplate,
    protected tags: LiTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LiFormTemplateActionEvent> {
    const menu = [
      this.getTagsButton('FORM_TEMPLATE', this.template.id, this.tags),
      this.getArchiveButton(),
      this.getDeleteButton(),
    ];

    return this.generateMenu(menu, event);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<LiFormTemplateActionEvent> {
    const menu: FlMenuDynamic[] = [
      this.getTagsButton('FORM_TEMPLATE', this.template.id, this.tags),
      this.getArchiveButton(),
      this.getDeleteButton(),
    ];

    return this.generateMenu(menu, event);
  }

  protected getArchiveButton(): FlMenuDynamic {
    if (this.template.isArchived) {
      return {
        type: 'button',
        text: 'li.form_unarchive_template',
        icon: 'unarchive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.form_unarchive_template',
            content: 'li.form_unarchive_template_confirmation',
            observable: this.injector.get(LiFormTemplateService).unarchive(this.template.id),
            successMessage: 'li.form_template_unarchived',
          }),
      };
    } else {
      return {
        type: 'button',
        text: 'li.form_archive_template',
        icon: 'archive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.form_archive_template',
            content: 'li.form_archive_template_confirmation',
            observable: this.injector.get(LiFormTemplateService).archive(this.template.id),
            successMessage: 'li.form_template_archived',
          }),
      };
    }
  }

  protected getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.form_delete_template',
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

  private onArchiveClosed(result: FlConfirmDialogResult<LiFormTemplate>): void {
    if (result.choice) {
      this.subject.next({
        action: result.result.isArchived ? 'archive' : 'unarchive',
        template: result.result,
      });
    }

    this.subject.complete();
  }

  private confirmDelete(): void {
    this.injector
      .get(FlDialogService)
      .openConfirmDialog({
        title: 'li.form_delete_template',
        content: 'li.form_delete_template_confirmation',
        observable: this.injector.get(LiFormTemplateService).delete(this.template.id),
        successMessage: 'li.form_template_deleted',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.choice) {
          this.subject.next({ action: 'delete', template: this.template });
        }
        this.subject.complete();
      });
  }
}
