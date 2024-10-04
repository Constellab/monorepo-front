import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolder, CaFolderWithHierarchy } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-form-dialog/ca-folder-form-dialog.component';
import { FlDialogService } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-folder-detail-info',
  templateUrl: './ca-folder-detail-info.component.html',
  styleUrl: './ca-folder-detail-info.component.scss'
})
export class CaFolderDetailInfoComponent {

  state = inject(CaFolderDetailState);
  folder$: Observable<CaFolder> = inject(CaFolderDetailState).getFolder$();

  dialogService = inject(FlDialogService);

  openUpdateFolderDialog(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'update',
      folderId: this.state.getCurrentFolder().id
    };

    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      folder => this.updateDialogClosed(folder)
    );
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.state.updateFolder(folder);
    }
  }
}
