import { Component, inject, input } from '@angular/core';
import {
  CaFolder,
  CaFolderWithHierarchy,
} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
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
import { TranslatePipe } from '@ngx-translate/core';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';

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
    TranslatePipe,
  ],
})
export class CaFolderDetailInfoComponent {
  folder = input.required<CaFolder>();
  canEditFolder = input.required<boolean>();

  private dialogService = inject(FlDialogService);
  private folderActionService = inject(CaFolderActionService);
  private eventState = inject(CaHierarchyObjectEventState);

  openUpdateFolderDialog(): void {
    this.folderActionService
      .openUpdateFolderDialog(this.folder().id)
      .subscribe((folder) => this.updateDialogClosed(folder));
  }

  openUpdateFolderLeaderDialog(): void {
    const dialogInput: CaUpdateFolderLeaderDialogInput = {
      folderId: this.folder().id,
      currentLeader: this.folder().leader,
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
      this.eventState.emitFolderUpdate(folder);
    }
  }
}
