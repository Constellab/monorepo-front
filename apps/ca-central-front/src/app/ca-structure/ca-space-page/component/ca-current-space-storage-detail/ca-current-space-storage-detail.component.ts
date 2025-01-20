import { Component } from '@angular/core';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';

/**
 * Dialog to show the detail of storage usage
 */
@Component({
    selector: 'ca-current-space-storage-detail',
    templateUrl: './ca-current-space-storage-detail.component.html',
    styleUrl: './ca-current-space-storage-detail.component.scss',
    standalone: false
})
export class CaCurrentSpaceStorageDetailComponent {
  storageUsage$ = this.spaceService.getCurrentSpaceStorageUsageDetail();

  constructor(private spaceService: CaSpaceService) {}
}
