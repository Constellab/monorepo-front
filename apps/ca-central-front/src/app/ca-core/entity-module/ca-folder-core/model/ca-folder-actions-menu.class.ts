import {
  CaFolder,
  CaFolderInfo,
  CaFolderWithHierarchy,
} from '../../../model/entities/folder/ca-folder.class';
import {
  FlConfirmDialogResult,
  FlDialogService,
  FlMenuDynamic,
  FlMenuDynamicService,
} from '@monorepo/front-core-lib';
import { mergeMap, Observable, Subject } from 'rxjs';
import { CaConstellabDocument } from '../../../model/entities/folder/ca-document.class';
import { CaRouterService } from '../../../service/ca-router.service';
import { CaSecurityService } from '../../../service/ca-security.service';
import { CaFolderActionService } from '../ca-folder-action.service';

export type CaFolderActionEvent =
  | {
      action: 'createChild';
      folder: CaFolderWithHierarchy;
    }
  | {
      action: 'update';
      folder: CaFolder;
    }
  | {
      action: 'delete';
      folder: CaFolderInfo;
    }
  | {
      action: 'createConstellabDocument';
      document: CaConstellabDocument;
    };

export class CaFolderActionsMenu {
  protected subject: Subject<CaFolderActionEvent> = new Subject();

  constructor(
    protected dialogService: FlDialogService,
    protected folderActionService: CaFolderActionService,
    protected menuDynamicService: FlMenuDynamicService,
    protected securityService: CaSecurityService,
    protected folderInfo: CaFolderInfo
  ) {}

  /**
   * Open the action menu for the folder in the table
   */
  public openTableItemActionMenu(event: MouseEvent): Observable<CaFolderActionEvent> {
    const menu = this.generateTableItemActionMenu();

    return this.openActionMenu(menu, event);
  }

  /**
   * Open the action menu when right-click on the folder children section
   */
  public openFolderChildrenActionMenu(event: MouseEvent): Observable<CaFolderActionEvent> {
    const menu = this.generateFolderChildrenActionMenu();

    return this.openActionMenu(menu, event);
  }

  public getCreateChildButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'create_sub_folder', translateText: true },
      icon: 'folder',
      onClick: () => this.openChildCreation(),
    };
  }

  public getOpenFolderButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'open_folder', translateText: true },
      icon: 'folder',
      link: CaRouterService.getFolderDetailRoute(this.folderInfo.id),
    };
  }

  public getUpdateFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'update_folder', translateText: true },
      icon: 'edit',
      onClick: () => this.openUpdateFolderDialog(),
    };
  }

  public getDeleteFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'delete_folder', translateText: true },
      icon: 'delete',
      onClick: () => this.openDeleteFolderDialog(),
      color: 'warn',
    };
  }

  protected openActionMenu(menu: FlMenuDynamic[], event: MouseEvent): Observable<CaFolderActionEvent> {
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

  protected canEditFolder(): boolean {
    return this.securityService.canEditFolder(this.folderInfo.leader.id);
  }

  private generateTableItemActionMenu(): FlMenuDynamic[] {
    const menu: FlMenuDynamic[] = [this.getOpenFolderButton()];

    if (this.canEditFolder()) {
      menu.push(this.getUpdateFolderButton(), this.getDeleteFolderButton());
    }
    return menu;
  }

  private generateFolderChildrenActionMenu(): FlMenuDynamic[] {
    return [
      this.getCreateChildButton(),
      {
        type: 'button',
        text: { text: 'create_constellab_document', translateText: true },
        icon: 'constellab_document',
        onClick: () => this.createConstellabDocument(),
      },
    ];
  }

  private openUpdateFolderDialog(): void {
    this.folderActionService
      .openUpdateFolderDialog(this.folderInfo.id)
      .subscribe((folder) => this.updateDialogClosed(folder));
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'update',
        folder: folder,
      });
    }
    this.subject.complete();
  }

  private openChildCreation(): void {
    this.folderActionService
      .openChildCreation(this.folderInfo.id)
      .subscribe((folder) => this.createChildSuccess(folder));
  }

  private createChildSuccess(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'createChild',
        folder: folder,
      });
    }
    this.subject.complete();
  }

  private openDeleteFolderDialog(): void {
    this.folderActionService
      .openDeleteFolderDialog(this.folderInfo.id)
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.subject.next({
        action: 'delete',
        folder: this.folderInfo,
      });
    }
    this.subject.complete();
  }

  private createConstellabDocument(): void {
    this.folderActionService
      .createConstellabDocument(this.folderInfo.id)
      .subscribe((doc: CaConstellabDocument) => this.createConstellabDocClosed(doc));
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.subject.next({
        action: 'createConstellabDocument',
        document: doc,
      });
    }
    this.subject.complete();
  }
}
