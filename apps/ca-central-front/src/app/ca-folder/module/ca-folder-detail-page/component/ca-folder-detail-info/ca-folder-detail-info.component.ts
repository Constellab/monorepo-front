import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaFolder,
  CaFolderWithHierarchy,
} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaUpdateFolderLeaderDialogComponent,
  CaUpdateFolderLeaderDialogInput,
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-update-folder-leader-dialog/ca-update-folder-leader-dialog.component';
import { CaFolderActionService } from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
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
