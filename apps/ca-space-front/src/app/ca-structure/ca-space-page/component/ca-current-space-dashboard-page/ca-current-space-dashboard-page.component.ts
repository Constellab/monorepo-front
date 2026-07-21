import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { Observable } from 'rxjs';

import { CaSpaceSettingsDto } from '../../../../ca-core/model/entities/space/ca-space.dto';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { CaCurrentSpaceDetailComponent } from '../ca-current-space-detail/ca-current-space-detail.component';
import { CaCurrentSpaceStorageComponent } from '../ca-current-space-storage/ca-current-space-storage.component';

@Component({
  selector: 'ca-current-space-dashboard-page',
  templateUrl: './ca-current-space-dashboard-page.component.html',
  styleUrls: ['./ca-current-space-dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSectionModule, CaCurrentSpaceDetailComponent, CaCurrentSpaceStorageComponent],
})
export class CaCurrentSpaceDashboardPageComponent {
  private spaceService = inject(CaSpaceService);

  spaceSettings$: Observable<CaSpaceSettingsDto> = this.spaceService.getCurrentSpaceSettings();
}
