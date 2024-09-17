import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlSnackBarService } from '@monorepo/front-core-lib';

// TODO IMPROVE STYLE
@Component({
  selector: 'ca-folder-settings',
  templateUrl: './ca-folder-settings.component.html',
  styleUrls: ['./ca-folder-settings.component.scss']
})
export class CaFolderSettingsComponent {

  state = inject(CaFolderDetailState);
  rightPanelState = inject(CaFolderRightPanelState);

  folder$: Observable<CaFolder> = this.state.getFolder$();

  // only allow storage setting for root folders
  showStorageSettings$: Observable<boolean> = inject(CaFolderDetailState).isRootFolder$();

  folderService = inject(CaFolderService);
  snackBarService = inject(FlSnackBarService);

  toggleChat(folder: CaFolder): void {
    this.folderService.activateChat(folder.id, !folder.chatEnabled).subscribe(
      (newFolder: CaFolder) => this.chatEnableSuccess(newFolder)
    );
  }

  private chatEnableSuccess(folder: CaFolder): void {
    this.state.updateFolder(folder);
    if (folder.chatEnabled) {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_activated', translateText: true });
      this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: folder.id, objectName: folder.title });
    } else {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_deactivated', translateText: true });
    }
  }
}
