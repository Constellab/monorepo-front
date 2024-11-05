import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-dashboard-page',
  templateUrl: './ca-lab-dashboard-page.component.html',
  styleUrls: ['./ca-lab-dashboard-page.component.scss'],
})
export class CaLabDashboardPageComponent {
  lab$: Observable<CaLab> = this.state.getLab$();

  constructor(private state: CaLabDetailPageState) {}
}
