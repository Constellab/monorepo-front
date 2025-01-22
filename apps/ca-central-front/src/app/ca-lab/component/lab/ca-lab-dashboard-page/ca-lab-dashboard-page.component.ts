import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-dashboard-page',
  templateUrl: './ca-lab-dashboard-page.component.html',
  styleUrls: ['./ca-lab-dashboard-page.component.scss'],
  standalone: false,
})
export class CaLabDashboardPageComponent {
  private state = inject(CaLabDetailPageState);

  lab$: Observable<CaLab> = this.state.getLab$();
}
