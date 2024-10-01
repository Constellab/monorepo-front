import {Component} from '@angular/core';
import {CaLabDetailPageState} from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-usage-page',
  templateUrl: './ca-lab-usage-page.component.html',
  styleUrls: ['./ca-lab-usage-page.component.scss'],
})
export class CaLabUsagePageComponent {

  id = this.state.getLabId();

  constructor(private state: CaLabDetailPageState) {
  }
}
