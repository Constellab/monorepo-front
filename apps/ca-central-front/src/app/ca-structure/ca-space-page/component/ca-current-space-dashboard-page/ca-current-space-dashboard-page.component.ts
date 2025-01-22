import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { CaSpaceSettingsDto } from '../../../../ca-core/model/entities/space/ca-space.dto';

@Component({
  selector: 'ca-current-space-dashboard-page',
  templateUrl: './ca-current-space-dashboard-page.component.html',
  styleUrls: ['./ca-current-space-dashboard-page.component.scss'],
  standalone: false,
})
export class CaCurrentSpaceDashboardPageComponent {
  private spaceService = inject(CaSpaceService);

  spaceSettings$: Observable<CaSpaceSettingsDto> = this.spaceService.getCurrentSpaceSettings();
}
