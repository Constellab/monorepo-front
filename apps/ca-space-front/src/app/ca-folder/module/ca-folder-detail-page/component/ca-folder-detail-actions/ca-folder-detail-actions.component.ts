import { Component, inject, Injector } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import {
  CaFolder,
  CaFolderWithHierarchy,
} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
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
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';

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
  private state = inject(CaFolderDetailState);
  private eventState = inject(CaHierarchyObjectEventState);
  private rightPanelState = inject(CaFolderRightPanelState);
  private folderActionService = inject(CaFolderActionService);
  private routerService = inject(CaRouterService);
  private hierarchyObjectState = inject(CaHierarchyObjectDetailState);
  private injector = inject(Injector);

  folderId$: Observable<string> = this.state.getFolderId$();
  folder$: Observable<CaFolder> = this.state.getFolder$();

  async openFolderActionMenu(folder: CaFolder, event: MouseEvent): Promise<void> {
    const isRootFolder = await firstValueFrom(this.state.isRootFolder$());
    const context = await this.hierarchyObjectState.getHierarchyContextPromise();
    const folderActionsMenu = new CaFolderDetailActionMenu(
      this.injector,
      {
        id: folder.id,
        name: folder.name,
        userRole: context.userRole,
      },
      isRootFolder,
      { tags: this.hierarchyObjectState.getTags() }
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

  async uploadFolder(file: File | File[]): Promise<void> {
    const folderId = await firstValueFrom(this.state.getFolderId$());
    this.folderActionService.uploadFolder(folderId, file);
  }

  openChildCreation(folder: CaFolder): void {
    this.folderActionService
      .openChildCreation(folder.id)
      .subscribe((folder) => this.createChildSuccess(folder));
  }

  private onFolderAction(folderEvent: CaFolderDetailActionEvent): void {
    if (!folderEvent) return;
    if (folderEvent.action === 'restoreObjectFromTrash') {
      this.state.refreshChildren();
    }
    this.eventState.emitFolderEvent(folderEvent);
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.routerService.navigateToDocumentDetail(doc.document.id);
    }
  }

  private createChildSuccess(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.eventState.emitCreateEvent(folder.hierarchyRepresentation, true);
    }
  }
}
