import { CaResourceBasicInfo } from '../../../ca-core/model/entities/folder/ca-resource.class';
import { mergeMap, Observable, Subject } from 'rxjs';
import { CaResourceService } from '../../../ca-core/service-api/ca-resource.service';
import { FlConfirmDialogInput } from '@monorepo/front-core-lib/fl-dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';

export type CaResourceActionEvent = {
  action: 'deleteResource';
  resource: CaResourceBasicInfo;
};

export class CaResourceActionMenu {
  protected subject: Subject<CaResourceActionEvent> = new Subject();

  constructor(
    private resourceService: CaResourceService,
    protected menuDynamicService: FlMenuDynamicService,
    private dialogService: FlDialogService,
    protected resourceInfo: CaResourceBasicInfo
  ) {}

  public openActionMenu(event: MouseEvent): Observable<CaResourceActionEvent> {
    const menu = this.generateTableItemActionMenu();

    const overlayRef = this.menuDynamicService.openDynamicMenuFromMouseEvent(menu, event);

    return overlayRef.detachments().pipe(
      mergeMap((menu: FlMenuDynamic) => {
        // when the menu was closed without clicking a button
        // we have to complete the subject
        // if the menu was a button, the subject will be completed in the button action
        if (!menu || menu.type !== 'button') {
          this.subject.complete();
        }
        return this.subject.asObservable();
      })
    );
  }

  private generateTableItemActionMenu(): FlMenuDynamic[] {
    return [this.getOpenInLabButton(), this.getDeleteResourceButton()];
  }

  public getDeleteResourceButton(): FlMenuDynamic {
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
      observable: this.resourceService.deleteById(this.resourceInfo.id),
      successMessage: 'resource_deleted',
    };

    this.dialogService
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

  public getOpenInLabButton(): FlMenuDynamic {
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
      this.resourceService.findById(this.resourceInfo.id).subscribe((resource) => {
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
