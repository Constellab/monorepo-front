import { CaResourceBasicInfo } from '../../../ca-core/model/entities/folder/ca-resource.class';
import { Observable } from 'rxjs';
import { CaResourceService } from '../../../ca-core/service-api/ca-resource.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';

export type CaResourceActionEvent = {
  action: 'deleteResource';
  resource: CaResourceBasicInfo;
};

export class CaResourceActionMenu extends CaHierarchyObjectBaseActionMenu<CaResourceActionEvent> {
  constructor(
    injector: Injector,
    private resourceInfo: CaResourceBasicInfo,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, resourceInfo.id, tags);
  }

  public openActionMenu(event: MouseEvent): Observable<CaResourceActionEvent> {
    const menu = [this.getOpenInLabButton(), this.getManageTagsButton(), this.getDeleteResourceButton()];
    return this.generateMenu(menu, event);
  }

  private getDeleteResourceButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'delete_resource',
      icon: 'delete',
      color: 'warn',
      onClick: () => this.openDeleteConfirmation(),
    };
  }

  private openDeleteConfirmation(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_resource',
      content: 'delete_resource_confirmation',
      observable: this.injector.get(CaResourceService).deleteById(this.resourceInfo.id),
      successMessage: 'resource_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.subject.next({ action: 'deleteResource', resource: this.resourceInfo });
    }
    this.subject.complete();
  }

  private getOpenInLabButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'open_resource_in_lab',
      icon: 'open_in_new',
      onClick: () => this.loadAndOpenInLab(),
    };
  }

  public loadAndOpenInLab(): void {
    if (this.resourceInfo.shareLink) {
      this.openInLab(this.resourceInfo.shareLink);
    } else {
      this.injector
        .get(CaResourceService)
        .findById(this.resourceInfo.id)
        .subscribe((resource) => {
          this.openInLab(resource.shareLink);
        });
    }
  }

  public openInLab(link: string): void {
    // open link in new tab
    window.open(link, '_blank');
    this.subject.complete();
  }
}
