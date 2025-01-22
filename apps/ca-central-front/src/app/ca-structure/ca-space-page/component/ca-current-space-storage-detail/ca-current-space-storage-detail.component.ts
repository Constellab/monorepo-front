import { Component, inject } from '@angular/core';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';

/**
 * Dialog to show the detail of storage usage
 */
@Component({
  selector: 'ca-current-space-storage-detail',
  templateUrl: './ca-current-space-storage-detail.component.html',
  styleUrl: './ca-current-space-storage-detail.component.scss',
  standalone: false,
})
export class CaCurrentSpaceStorageDetailComponent {
  private spaceService = inject(CaSpaceService);

  storageUsage$ = this.spaceService.getCurrentSpaceStorageUsageDetail();
}
