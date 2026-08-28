import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom, Observable, of } from 'rxjs';

import { CaBucketLocationInlineComponent } from '../../../../../ca-core/entity-module/ca-object-storage-core/component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { CaFolderStorageDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import {
  CaFolderConfigureStorageComponent,
  CaFolderConfigureStorageInput,
} from '../ca-folder-configure-storage/ca-folder-configure-storage.component';

/**
 * Component to show the storage settings of the folder (bucket) with possibility to configure it.
 */
@Component({
  selector: 'ca-folder-storage-settings',
  templateUrl: './ca-folder-storage-settings.component.html',
  styleUrls: ['./ca-folder-storage-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  @Input({ required: true }) folderId: string;

  private folderService = inject(CaFolderService);
  private dialogService = inject(FlDialogService);

  folderStorage: Observable<CaFolderStorageDTO | null>;

  ngOnInit(): void {
    this.folderStorage = this.folderService.getFolderStorages(this.folderId);
  }

  async configureStorage(rootFolderId: string): Promise<void> {
    const folderStorage = await firstValueFrom(this.folderStorage);
    if (!folderStorage) return;

    const input: CaFolderConfigureStorageInput = {
      mode: 'update',
      folderId: rootFolderId,
      object: {
        rootFolderId: rootFolderId,
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
