import {Component} from '@angular/core';
import {CaSpaceStorage} from '../../../../ca-core/model/entities/space/ca-space.dto';
import {ThemePalette} from '@angular/material/core';
import {Observable, of, share} from 'rxjs';
import {CaSpaceService} from '../../../../ca-core/service-api/ca-space.service';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaSpaceStorageFormDialogComponent,
  CaSpaceStorageFormDialogInput
} from '../../../../ca-core/entity-module/ca-space-core/component/ca-space-storage-form-dialog/ca-space-storage-form-dialog.component';
import {
  CaCurrentSpaceStorageDetailComponent
} from '../ca-current-space-storage-detail/ca-current-space-storage-detail.component';
import {
  CaCurrentSpaceUpdateStorageDialogComponent,
  CaStorageLimitUpdateDialogInput
} from '../ca-current-space-update-storage-dialog/ca-current-space-update-storage-dialog.component';

/**
 * Component to show information about the current space storage
 * with possibility to see storage detail and upgrade storage
 */
@Component({
  selector: 'ca-current-space-storage',
  templateUrl: './ca-current-space-storage.component.html',
  styleUrl: './ca-current-space-storage.component.scss'
})
export class CaCurrentSpaceStorageComponent {

  spaceStorage$: Observable<CaSpaceStorage> = this.spaceService.getCurrentSpaceStorage()
    .pipe(share());

  constructor(private spaceService: CaSpaceService,
              private dialogService: FlDialogService) {
  }

  spinnerColor(usagePercent: number): ThemePalette {
    return usagePercent > 80 ? 'warn' : 'primary';
  }

  updateStorageLimit(spaceStorage: CaSpaceStorage): void {
    const data: CaStorageLimitUpdateDialogInput = {
      mode: 'update',
      object: {limit: spaceStorage.storageLimit}
    };

    this.dialogService.openSmallDialog(CaCurrentSpaceUpdateStorageDialogComponent, {data: data})
      .afterClosed().subscribe(spaceStorage => this.onUpdateClosed(spaceStorage));
  }

  updateDefaultStorage(spaceStorage: CaSpaceStorage): void {
    const data: CaSpaceStorageFormDialogInput = {
      mode: 'update',
      object: {
        defaultProjectStorageLocation: spaceStorage.defaultProjectStorageLocation,
        defaultProjectBackupStorageLocation: spaceStorage.defaultBackupProjectStorageLocation
      }
    };

    this.dialogService.openSmallDialog(CaSpaceStorageFormDialogComponent, {data: data})
      .afterClosed().subscribe(spaceStorage => this.onUpdateClosed(spaceStorage));
  }

  private onUpdateClosed(spaceStorage?: CaSpaceStorage): void {
    if (spaceStorage) {
      this.spaceStorage$ = of(spaceStorage);
    }
  }

  openStorageDetail(): void {
    this.dialogService.openSmallDialog(CaCurrentSpaceStorageDetailComponent);
  }
}
