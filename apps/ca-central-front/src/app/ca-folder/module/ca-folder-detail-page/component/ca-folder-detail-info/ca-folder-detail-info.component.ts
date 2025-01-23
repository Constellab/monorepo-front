import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaFolder,
  CaFolderWithHierarchy,
} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaUpdateFolderLeaderDialogComponent,
  CaUpdateFolderLeaderDialogInput,
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-update-folder-leader-dialog/ca-update-folder-leader-dialog.component';
import { CaFolderActionService } from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-detail-info',
  templateUrl: './ca-folder-detail-info.component.html',
  styleUrl: './ca-folder-detail-info.component.scss',
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlUserModule,
    FlDateModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaFolderDetailInfoComponent {
  private state = inject(CaFolderDetailState);

  folder$: Observable<CaFolder> = this.state.getFolder$();
  canEditFolder$: Observable<boolean> = this.state.canEditFolder$();

  private dialogService = inject(FlDialogService);

  private folderActionService = inject(CaFolderActionService);

  openUpdateFolderDialog(): void {
    this.folderActionService
      .openUpdateFolderDialog(this.state.getCurrentFolder().id)
      .subscribe((folder) => this.updateDialogClosed(folder));
  }

  openUpdateFolderLeaderDialog(folder: CaFolder): void {
    const dialogInput: CaUpdateFolderLeaderDialogInput = {
      folderId: folder.id,
      currentLeader: folder.leader,
      users$: this.state.getUsers().connect(),
    };

    this.dialogService
      .openSmallDialog(CaUpdateFolderLeaderDialogComponent, {
        data: dialogInput,
      })
      .afterClosed()
      .subscribe((leader) => this.updateDialogClosed(leader));
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.state.updateFolder(folder);
    }
  }
}
