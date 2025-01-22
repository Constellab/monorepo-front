import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlConfirmDialogResult, FlSnackBarService } from '@monorepo/front-core-lib';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaFolderActionService } from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { CaFolderDetailInfoComponent } from '../ca-folder-detail-info/ca-folder-detail-info.component';
import { MatButton } from '@angular/material/button';
import { CaFolderStorageSettingsComponent } from '../ca-folder-storage-settings/ca-folder-storage-settings.component';
import { CaFolderStorageUsageSectionComponent } from '../ca-folder-storage-usage-section/ca-folder-storage-usage-section.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-settings',
  templateUrl: './ca-folder-settings.component.html',
  styleUrls: ['./ca-folder-settings.component.scss'],
  imports: [
    FlTextIconModule,
    MatIcon,
    CaFolderDetailInfoComponent,
    MatButton,
    CaFolderStorageSettingsComponent,
    CaFolderStorageUsageSectionComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaFolderSettingsComponent {
  // only allow storage setting for root folders
  showStorageSettings$: Observable<boolean> = inject(CaFolderDetailState).isRootFolder$();
  private state = inject(CaFolderDetailState);
  folder$: Observable<CaFolder> = this.state.getFolder$();

  canEditFolder$: Observable<boolean> = this.state.canEditFolder$();
  private rightPanelState = inject(CaFolderRightPanelState);
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);
  private snackBarService = inject(FlSnackBarService);

  toggleChat(folder: CaFolder): void {
    this.folderService
      .activateChat(folder.id, !folder.chatEnabled)
      .subscribe((newFolder: CaFolder) => this.chatEnableSuccess(newFolder));
  }

  openDeleteFolderDialog(folder: CaFolder): void {
    this.folderActionService
      .openDeleteFolderDialog(folder.id)
      .subscribe((result) => this.onDeleteClosed(result, folder));
  }

  private chatEnableSuccess(folder: CaFolder): void {
    this.state.updateFolder(folder);
    if (folder.chatEnabled) {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_activated', translateText: true });
    } else {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_deactivated', translateText: true });
    }
  }

  private onDeleteClosed(result: FlConfirmDialogResult, folder: CaFolder): void {
    if (result.choice) {
      this.rightPanelState.closeRightPanel();
      this.state.deleteHierarchyObject(folder.id);
    }
  }
}
