import { Component, inject } from '@angular/core';
import { CaSpaceStorage } from '../../../../ca-core/model/entities/space/ca-space.dto';
import { ThemePalette } from '@angular/material/core';
import { Observable, of, share } from 'rxjs';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaSpaceStorageFormDialogComponent,
  CaSpaceStorageFormDialogInput,
} from '../../../../ca-core/entity-module/ca-space-core/component/ca-space-storage-form-dialog/ca-space-storage-form-dialog.component';
import {
  CaCurrentSpaceStorageDetailComponent,
} from '../ca-current-space-storage-detail/ca-current-space-storage-detail.component';
import {
  CaCurrentSpaceUpdateStorageDialogComponent,
  CaStorageLimitUpdateDialogInput,
} from '../ca-current-space-update-storage-dialog/ca-current-space-update-storage-dialog.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import {
  CaIsAdminDirective,
} from '../../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { MatButton } from '@angular/material/button';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import {
  CaBucketLocationInlineComponent,
} from '../../../../ca-core/entity-module/ca-object-storage-core/component/ca-bucket-location-inline/ca-bucket-location-inline.component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show information about the current space storage
 * with possibility to see storage detail and upgrade storage
 */
@Component({
  selector: 'ca-current-space-storage',
  templateUrl: './ca-current-space-storage.component.html',
  styleUrl: './ca-current-space-storage.component.scss',
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    CaIsAdminDirective,
    MatButton,
    FlSectionModule,
    MatProgressSpinner,
    NgClass,
    FlKeyValueModule,
    CaBucketLocationInlineComponent,
    AsyncPipe,
    DecimalPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaCurrentSpaceStorageComponent {
  private spaceService = inject(CaSpaceService);
  private dialogService = inject(FlDialogService);

  spaceStorage$: Observable<CaSpaceStorage> = this.spaceService.getCurrentSpaceStorage().pipe(share());

  spinnerColor(usagePercent: number): ThemePalette {
    return usagePercent > 80 ? 'warn' : 'primary';
  }

  updateStorageLimit(spaceStorage: CaSpaceStorage): void {
    const data: CaStorageLimitUpdateDialogInput = {
      mode: 'update',
      object: { limit: spaceStorage.cloudStorageLimit },
    };

    this.dialogService
      .openSmallDialog(CaCurrentSpaceUpdateStorageDialogComponent, { data: data })
      .afterClosed()
      .subscribe((spaceStorage) => this.onUpdateClosed(spaceStorage));
  }

  updateDefaultStorage(spaceStorage: CaSpaceStorage): void {
    const data: CaSpaceStorageFormDialogInput = {
      mode: 'update',
      object: {
        defaultFolderStorageLocation: spaceStorage.defaultFolderStorageLocation,
        defaultFolderBackupStorageLocation: spaceStorage.defaultBackupFolderStorageLocation,
      },
    };

    this.dialogService
      .openSmallDialog(CaSpaceStorageFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((spaceStorage) => this.onUpdateClosed(spaceStorage));
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
