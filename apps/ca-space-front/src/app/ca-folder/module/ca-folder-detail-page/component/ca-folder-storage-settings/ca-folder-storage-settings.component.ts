import { Component, inject, OnInit } from '@angular/core';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { firstValueFrom, mergeMap, Observable, of } from 'rxjs';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaFolderConfigureStorageComponent,
  CaFolderConfigureStorageInput,
} from '../ca-folder-configure-storage/ca-folder-configure-storage.component';
import { CaFolderStorageDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import {
  CaBucketLocationInlineComponent,
} from '../../../../../ca-core/entity-module/ca-object-storage-core/component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show the storage settings of the folder (bucket) with possibility to configure it.
 */
@Component({
  selector: 'ca-folder-storage-settings',
  templateUrl: './ca-folder-storage-settings.component.html',
  styleUrls: ['./ca-folder-storage-settings.component.scss'],
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    CaBucketLocationInlineComponent,
    MatButton,
    TranslatePipe,
  ],
})
export class CaFolderStorageSettingsComponent implements OnInit {
  private folderService = inject(CaFolderService);
  private state = inject(CaFolderDetailState);
  private dialogService = inject(FlDialogService);

  folderStorage: Observable<CaFolderStorageDTO>;

  ngOnInit(): void {
    this.folderStorage = this.state
      .getFolderId$()
      .pipe(mergeMap((folderId) => this.folderService.getFolderStorages(folderId)));
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
      },
    };
    this.dialogService
      .openSmallDialog(CaFolderConfigureStorageComponent, { data: input })
      .afterClosed()
      .subscribe((bucket) => this.onConfiguredClosed(bucket));
  }

  private onConfiguredClosed(buckets?: CaFolderStorageDTO): void {
    if (buckets) {
      this.folderStorage = of(buckets);
    }
  }
}
