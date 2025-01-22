import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaSpaceService } from '../../../../ca-core/service-api/ca-space.service';
import { CaSpaceSettingsDto } from '../../../../ca-core/model/entities/space/ca-space.dto';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { CaCurrentSpaceDetailComponent } from '../ca-current-space-detail/ca-current-space-detail.component';
import { CaIsSpaceAdminDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-space-admlin/ca-is-space-admin.directive';
import { CaCurrentSpaceInvitListComponent } from '../ca-current-space-invit-list/ca-current-space-invit-list.component';
import { CaCurrentSpaceStorageComponent } from '../ca-current-space-storage/ca-current-space-storage.component';

@Component({
  selector: 'ca-current-space-dashboard-page',
  templateUrl: './ca-current-space-dashboard-page.component.html',
  styleUrls: ['./ca-current-space-dashboard-page.component.scss'],
  imports: [
    FlSectionModule,
    CaCurrentSpaceDetailComponent,
    CaIsSpaceAdminDirective,
    CaCurrentSpaceInvitListComponent,
    CaCurrentSpaceStorageComponent,
  ],
})
export class CaCurrentSpaceDashboardPageComponent {
  private spaceService = inject(CaSpaceService);

  spaceSettings$: Observable<CaSpaceSettingsDto> = this.spaceService.getCurrentSpaceSettings();
}
