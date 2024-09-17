import { CaFolder, CaFolderInfo, CaFolderWithHierarchy } from '../../../model/entities/folder/ca-folder.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlMenuDynamic,
  FlMenuDynamicService
} from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../service-api/ca-folder.service';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput
} from '../component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import {
  CaUpdateFolderLeaderDialogComponent,
  CaUpdateFolderLeaderDialogInput
} from '../component/ca-update-folder-leader-dialog/ca-update-folder-leader-dialog.component';
import { mergeMap, Observable, Subject } from 'rxjs';
import { CaRouterService } from '../../../service/ca-router.service';

export type CaFolderActionEvent = {
  action: 'createChild';
  folder: CaFolderWithHierarchy;
} | {
  action: 'update';
  folder: CaFolder;
} | {
  action: 'delete';
  folder: CaFolderInfo;
}

export class CaFolderActionsMenu {

  private subject: Subject<CaFolderActionEvent> = new Subject();

  constructor(private dialogService: FlDialogService,
              private folderService: CaFolderService,
              private menuDynamicService: FlMenuDynamicService,
              private folderInfo: CaFolderInfo) {
  }

  public openActionMenu(event: MouseEvent): Observable<CaFolderActionEvent> {
    const menu = this.generateActionMenu();

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

  private generateActionMenu(): FlMenuDynamic[] {
    return [
      {
        type: 'button',
        text: { text: 'new_sub_folder', translateText: true },
        icon: 'add',
        onClick: () => this.openChildCreation()
      },
      {
        type: 'button',
        text: { text: 'update_folder', translateText: true },
        icon: 'edit',
        onClick: () => this.openUpdateFolderDialog()
      },
      {
        type: 'button',
        text: { text: 'change_folder_leader', translateText: true },
        icon: 'person',
        onClick: () => this.openUpdateFolderLeaderDialog()
      },
      {
        type: 'link',
        text: { text: 'activities', translateText: true },
        icon: 'task',
        link: CaRouterService.getFolderActivityRoute(this.folderInfo.id)
      },
      {
        type: 'button',
        text: { text: 'delete_folder', translateText: true },
        icon: 'delete',
        onClick: () => this.openDeleteFolderDialog(),
        color: 'warn'
      }
    ];
  }

  openUpdateFolderDialog(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'update',
      folderId: this.folderInfo.id
    };

    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      folder => this.updateDialogClosed(folder)
    );
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'update',
        folder: folder
      });
    }
    this.subject.complete();
  }

  openChildCreation(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'create',
      parentId: this.folderInfo.id
    };

    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      folder => this.createChildSuccess(folder)
    );
  }

  private createChildSuccess(folder: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'createChild',
        folder: folder
      });
    }
    this.subject.complete();
  }

  openUpdateFolderLeaderDialog(): void {
    const dialogInput: CaUpdateFolderLeaderDialogInput = {
      folderId: this.folderInfo.id,
      currentLeader: this.folderInfo.leader,
      users$: this.folderService.getUsersOfFolder(this.folderInfo.id)
    };

    this.dialogService.openSmallDialog(CaUpdateFolderLeaderDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      leader => this.onLeaderClosed(leader)
    );
  }

  private onLeaderClosed(folder: CaFolder): void {
    if (folder) {
      this.subject.next({
        action: 'update',
        folder: folder
      });
    }
    this.subject.complete();
  }

  openDeleteFolderDialog(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_folder',
      content: 'delete_folder_confirm',
      translateTitleAndContent: true,
      observable: this.folderService.delete(this.folderInfo.id),
      successMessage: 'folder_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.subject.next({
        action: 'delete',
        folder: this.folderInfo
      });
    }
    this.subject.complete();
  }

}
