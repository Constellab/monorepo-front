import {Component} from '@angular/core';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';

@Component({
  selector: 'ca-lab-instance-usage-page',
  templateUrl: './ca-lab-instance-usage-page.component.html',
  styleUrls: ['./ca-lab-instance-usage-page.component.scss'],
})
export class CaLabInstanceUsagePageComponent {

  id = this.state.getLabInstanceId();

  constructor(private state: CaLabInstanceDetailPageState) {
  }
}
