import { Component, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import {
  CaFolder,
  CaFolderWithHierarchy,
} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlDialogService, FlMenuDynamicService } from '@monorepo/front-core-lib';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaSecurityService } from '../../../../../ca-core/service/ca-security.service';
import {
  CaFolderDetailActionEvent,
  CaFolderDetailActionMenu,
} from '../../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-detail-action-menu.class';
import { CaConstellabDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { CaFolderActionService } from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CaNotificationMarkDirective } from '../../../../../ca-core/entity-module/ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { FlInputFileModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-input-file/fl-input-file.module';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-detail-actions',
  templateUrl: './ca-folder-detail-actions.component.html',
  styleUrl: './ca-folder-detail-actions.component.scss',
  imports: [
    MatIconButton,
    MatTooltip,
    CaNotificationMarkDirective,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    FlInputFileModule,
    MatMenuItem,
    FlIconModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaFolderDetailActionsComponent {
  private dialogService = inject(FlDialogService);
  private state = inject(CaFolderDetailState);
  private rightPanelState = inject(CaFolderRightPanelState);
  private menuDynamicService = inject(FlMenuDynamicService);
  private folderActionService = inject(CaFolderActionService);
  private securityService = inject(CaSecurityService);
  private routerService = inject(CaRouterService);

  folderId$: Observable<string> = this.state.getFolderId$();
  folder$: Observable<CaFolder> = this.state.getFolder$();

  async openFolderActionMenu(folder: CaFolder, event: MouseEvent): Promise<void> {
    const isRootFolder = await firstValueFrom(this.state.isRootFolder$());
    const folderActionsMenu = new CaFolderDetailActionMenu(
      this.dialogService,
      this.folderActionService,
      this.menuDynamicService,
      this.securityService,
      this.rightPanelState,
      {
        id: folder.id,
        name: folder.name,
        leader: folder.leader,
      },
      isRootFolder,
      this.state.getUsers()
    );

    folderActionsMenu.openDetailActionMenu(event).subscribe((event) => {
      this.onFolderAction(event);
    });
  }

  openDescription(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'description', objectId: folder.id });
  }

  openChat(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: folder.id });
  }

  createConstellabDocument(folder: CaFolder): void {
    this.folderActionService
      .createConstellabDocument(folder.id)
      .subscribe((doc: CaConstellabDocument) => this.createConstellabDocClosed(doc));
  }

  async uploadFile(file: File | File[]): Promise<void> {
    const folderId = await firstValueFrom(this.state.getFolderId$());
    this.folderActionService.uploadDocument(folderId, file);
  }

  openChildCreation(folder: CaFolder): void {
    this.folderActionService
      .openChildCreation(folder.id)
      .subscribe((folder) => this.createChildSuccess(folder));
  }

  private onFolderAction(folderEvent: CaFolderDetailActionEvent): void {
    if (!folderEvent) return;
    if (folderEvent.action === 'update') {
      this.state.updateFolder(folderEvent.folder);
    } else if (folderEvent.action === 'delete') {
      this.state.deleteHierarchyObject(folderEvent.folder.id);
    } else if (folderEvent.action === 'createChild') {
      this.state.addChild(folderEvent.folder.hierarchyRepresentation);
    } else if (folderEvent.action === 'restoreFileFromTrash') {
      this.state.refreshChildren();
    }
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.routerService.navigateToDocumentDetail(doc.document.id);
    }
  }

  private createChildSuccess(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.state.addChild(folder.hierarchyRepresentation);
    }
  }
}
