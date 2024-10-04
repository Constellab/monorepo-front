import {Component, OnInit} from '@angular/core';
import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';
import {CaFolderDetailState} from '../../state/ca-folder-detail.state';
import {firstValueFrom, mergeMap, Observable, of} from 'rxjs';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaFolderConfigureStorageComponent,
  CaFolderConfigureStorageInput
} from '../ca-folder-configure-storage/ca-folder-configure-storage.component';
import {CaFolderStorageDTO} from '../../../../../ca-core/model/entities/folder/ca-folder.class';

/**
 * Component to show the storage settings of the folder (bucket) with possibility to configure it.
 */
@Component({
  selector: 'ca-folder-storage-settings',
  templateUrl: './ca-folder-storage-settings.component.html',
  styleUrls: ['./ca-folder-storage-settings.component.scss']
})
export class CaFolderStorageSettingsComponent implements OnInit {

  folderStorage: Observable<CaFolderStorageDTO>;

  constructor(private folderService: CaFolderService,
              private state: CaFolderDetailState,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.folderStorage = this.state.getFolderId$().pipe(
      mergeMap(folderId => this.folderService.getFolderStorages(folderId))
    );
  }

  async configureStorage(): Promise<void> {
    const folderId = await firstValueFrom(this.state.getFolderId$());
    const folderStorage = await firstValueFrom(this.folderStorage);

    const input: CaFolderConfigureStorageInput = {
      mode: 'update',
      folderId: folderId,
      object: {
        mainStorage: folderStorage.mainStorage,
        backupStorage: folderStorage.backupStorage,
      }
    };
    this.dialogService.openSmallDialog(CaFolderConfigureStorageComponent, {data: input}).afterClosed().subscribe(
      bucket => this.onConfiguredClosed(bucket)
    );
  }

  private onConfiguredClosed(buckets?: CaFolderStorageDTO): void {
    if (buckets) {
      this.folderStorage = of(buckets);
    }
  }

}
