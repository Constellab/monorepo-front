import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaLabDetailComponent } from '../ca-lab-detail/ca-lab-detail.component';
import { CaLabServerInfoCardComponent } from '../../server/ca-lab-server-info-card/ca-lab-server-info-card.component';
import { CaLabUsersListComponent } from '../../user/ca-lab-users-list/ca-lab-users-list.component';
import { CaLabFoldersListComponent } from '../../folder/ca-lab-folders-list/ca-lab-folders-list.component';
import { CaLabFreeCardInfoComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-free-card-info/ca-lab-free-card-info.component';

@Component({
  selector: 'ca-lab-dashboard-page',
  templateUrl: './ca-lab-dashboard-page.component.html',
  styleUrls: ['./ca-lab-dashboard-page.component.scss'],
  imports: [
    FlSectionModule,
    CaLabDetailComponent,
    CaLabServerInfoCardComponent,
    CaLabUsersListComponent,
    CaLabFoldersListComponent,
    CaLabFreeCardInfoComponent,
  ],
})
export class CaLabDashboardPageComponent {
  private state = inject(CaLabDetailPageState);

  lab$: Observable<CaLab> = this.state.getLab$();
}
