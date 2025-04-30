import { Component, inject } from '@angular/core';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { CaFolderStorageUsageComponent } from '../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-storage-usage/ca-folder-storage-usage.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to show the detail of storage usage
 */
@Component({
  selector: 'ca-current-space-storage-detail',
  templateUrl: './ca-current-space-storage-detail.component.html',
  styleUrl: './ca-current-space-storage-detail.component.scss',
  imports: [FlDialogModule, MatDialogContent, CaFolderStorageUsageComponent, TranslatePipe],
})
export class CaCurrentSpaceStorageDetailComponent {
  private spaceService = inject(CaSpaceService);

  storageUsage$ = this.spaceService.getCurrentSpaceStorageUsageDetail();
}
