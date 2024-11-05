import { Component, Input } from '@angular/core';
import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';

@Component({
  selector: 'ca-lab-server-complete-info',
  templateUrl: './ca-lab-server-complete-info.component.html',
  styleUrls: ['./ca-lab-server-complete-info.component.scss'],
})
export class CaLabServerCompleteInfoComponent {
  @Input({ required: true }) serverCompleteInfo: CaServerCompleteInfo;
}
