import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaChatService } from '../../../../../ca-core/service-api/ca-chat.service';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaHierarchyObjectService } from '../../../../../ca-core/service-api/ca-hierarchy-object.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObjectEvent,
  CaHierarchyObjectEventState,
} from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaFolderDetailInfoComponent } from '../ca-folder-detail-info/ca-folder-detail-info.component';
import { CaFolderStorageSettingsComponent } from '../ca-folder-storage-settings/ca-folder-storage-settings.component';
import { CaFolderStorageUsageSectionComponent } from '../ca-folder-storage-usage-section/ca-folder-storage-usage-section.component';

@Component({
  selector: 'ca-folder-settings',
  templateUrl: './ca-folder-settings.component.html',
  styleUrls: ['./ca-folder-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlTextIconModule,
    MatIcon,
    CaFolderDetailInfoComponent,
    MatButton,
    CaFolderStorageSettingsComponent,
    CaFolderStorageUsageSectionComponent,
    TranslatePipe,
    FlSectionModule,
    AsyncPipe,
  ],
})
export class CaFolderSettingsComponent implements OnInit, OnDestroy {
  @Input({ required: true }) folderId: string;

  private eventState = inject(CaHierarchyObjectEventState);
  private rightPanelState = inject(CaFolderRightPanelState);
  private folderService = inject(CaFolderService);
  private chatService = inject(CaChatService);
  private snackBarService = inject(FlSnackBarService);
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private dialogService = inject(FlDialogService);

  folder: CaFolder;
  canEditFolder$ = inject(CaHierarchyObjectDetailState).canEditHierarchyObject$();
  isLoading: boolean = true;

  private subscription: Subscription;

  ngOnInit(): void {
    this.folderService.getById(this.folderId).subscribe({
      next: (folder) => this.onFolderLoaded(folder),
      error: () => (this.isLoading = false),
    });
    this.subscription = this.eventState.getEvent$().subscribe((event) => this.onEvent(event));
  }

  private onFolderLoaded(folder: CaFolder): void {
    this.folder = folder;
    this.isLoading = false;
  }

  private onEvent(event: CaHierarchyObjectEvent): void {
    if (event.action === 'updateFolder') {
      if (this.folderId === event.folder.id) {
        this.onFolderLoaded(event.folder);
      }
    }
  }

  toggleChat(folder: CaFolder): void {
    this.chatService
      .activateChat(folder.id, !folder.chatEnabled)
      .subscribe((newFolder: CaFolder) => this.chatEnableSuccess(newFolder));
  }

  openMoveToTrashDialog(folder: CaFolder): void {
    const input: FlConfirmDialogInput = {
      title: 'move_object_to_trash',
      content: 'move_object_to_trash_confirmation',
      observable: this.hierarchyObjectService.moveToTrash(folder.id),
      successMessage: 'object_moved_to_trash',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onMoveToTrashClosed(result));
  }

  private onMoveToTrashClosed(result: FlConfirmDialogResult<CaHierarchyObject>): void {
    if (result.choice) {
      this.eventState.emitFolderEvent({ action: 'moveToTrash', hierarchyObject: result.result });
      this.rightPanelState.closeRightPanel();
    }
  }

  private chatEnableSuccess(folder: CaFolder): void {
    this.eventState.emitFolderUpdate(folder);
    if (folder.chatEnabled) {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_activated', translateText: true });
    } else {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_deactivated', translateText: true });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
